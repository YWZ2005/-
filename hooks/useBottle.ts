import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Bottle, ThrowBottleParams } from '@/types';
import { Json } from '@/types/database';
import {
  DAILY_THROW_LIMIT,
  BOTTLE_EXPIRES_HOURS,
  CREDIT_THRESHOLD,
  INTEREST_TAG_MATCH_WEIGHT,
  FISH_BOTTLE_RETRY_COUNT,
  FISH_BOTTLE_CANDIDATE_LIMIT,
} from '@/lib/constants';

interface UseBottleReturn {
  isThrowing: boolean;
  isFishing: boolean;
  error: string | null;
  throwBottle: (params: ThrowBottleParams) => Promise<{ success: boolean; bottleId?: string; error?: string }>;
  fishBottle: () => Promise<{ success: boolean; bottle?: Bottle; throwerCreditScore?: number; error?: string }>;
}

interface ThrowerInfo {
  credit_score: number;
}

interface BottleCandidate {
  id: string;
  bottle_type: string;
  content: Json;
  status: string;
  thrower_id: string;
  fisher_id: string | null;
  tags: string[] | null;
  created_at: string;
  expires_at: string | null;
  thrower: ThrowerInfo;
}

const getStartOfDay = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

const calculateExpiresAt = (): Date => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + BOTTLE_EXPIRES_HOURS);
  return expiresAt;
};

const weightedRandomSelect = (
  candidates: BottleCandidate[],
  userInterestTags: string[] = []
): BottleCandidate => {
  if (candidates.length === 0) {
    throw new Error('No candidates available');
  }

  const timestamps = candidates.map((b) => new Date(b.created_at).getTime());
  const oldestTime = Math.min(...timestamps);
  const newestTime = Math.max(...timestamps);
  const timeRange = newestTime - oldestTime || 1;

  const weights = candidates.map((bottle) => {
    let weight = 1.0;

    const bottleTags = bottle.tags ?? [];
    const matchingTags = bottleTags.filter((tag: string) => userInterestTags.includes(tag));
    if (matchingTags.length > 0) {
      weight += INTEREST_TAG_MATCH_WEIGHT;
    }

    const bottleTime = new Date(bottle.created_at).getTime();
    const freshness = (bottleTime - oldestTime) / timeRange;
    weight += freshness * 0.3;

    return weight;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < candidates.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return candidates[i];
    }
  }

  return candidates[candidates.length - 1];
};

const isBottle = (obj: unknown): obj is Bottle => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'bottle_type' in obj &&
    'content' in obj &&
    'status' in obj &&
    'thrower_id' in obj &&
    'created_at' in obj
  );
};

export function useBottle(): UseBottleReturn {
  const [isThrowing, setIsThrowing] = useState<boolean>(false);
  const [isFishing, setIsFishing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const throwBottle = useCallback(
    async (params: ThrowBottleParams): Promise<{ success: boolean; bottleId?: string; error?: string }> => {
      setError(null);
      setIsThrowing(true);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          const errMsg = '请先登录';
          setError(errMsg);
          return { success: false, error: errMsg };
        }

        const todayStart = getStartOfDay().toISOString();

        const { count, error: countError } = await supabase
          .from('bottles')
          .select('*', { count: 'exact', head: true })
          .eq('thrower_id', user.id)
          .gte('created_at', todayStart);

        if (countError) {
          setError(countError.message);
          return { success: false, error: countError.message };
        }

        if ((count ?? 0) >= DAILY_THROW_LIMIT) {
          const errMsg = '今日扔瓶次数已用完，明天再来吧';
          setError(errMsg);
          return { success: false, error: errMsg };
        }

        const expiresAt = calculateExpiresAt().toISOString();
        const contentJson = params.content as unknown as Json;

        const insertData = {
          bottle_type: params.type,
          content: contentJson,
          status: 'floating' as const,
          thrower_id: user.id,
          tags: params.tags ?? [],
          expires_at: expiresAt,
        };

        const { data: insertedBottle, error: insertError } = await supabase
          .from('bottles')
          .insert(insertData)
          .select()
          .single();

        if (insertError || !insertedBottle) {
          setError(insertError?.message ?? '扔瓶失败');
          return { success: false, error: insertError?.message ?? '扔瓶失败' };
        }

        const inserted = insertedBottle as unknown as { id: string };
        return { success: true, bottleId: inserted.id };
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '扔瓶失败，请稍后重试';
        setError(errMsg);
        return { success: false, error: errMsg };
      } finally {
        setIsThrowing(false);
      }
    },
    []
  );

  const fishBottle = useCallback(
    async (): Promise<{ success: boolean; bottle?: Bottle; throwerCreditScore?: number; error?: string }> => {
      setError(null);
      setIsFishing(true);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          const errMsg = '请先登录';
          setError(errMsg);
          return { success: false, error: errMsg };
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, credit_score')
          .eq('id', user.id)
          .single();

        if (userError || !userData) {
          const errMsg = userError?.message ?? '获取用户信息失败';
          setError(errMsg);
          return { success: false, error: errMsg };
        }

        const userCreditScore = (userData as { credit_score: number }).credit_score;
        const isHighCredit = userCreditScore >= CREDIT_THRESHOLD;

        const fetchCandidates = async (onlyHighCredit: boolean): Promise<BottleCandidate[]> => {
          let query = supabase
            .from('bottles')
            .select(
              `
              id,
              bottle_type,
              content,
              status,
              thrower_id,
              fisher_id,
              tags,
              created_at,
              expires_at,
              thrower:users!bottles_thrower_id_fkey (
                credit_score
              )
            `
            )
            .eq('status', 'floating')
            .neq('thrower_id', user.id)
            .limit(FISH_BOTTLE_CANDIDATE_LIMIT);

          if (onlyHighCredit) {
            query = query.gte('thrower.credit_score', CREDIT_THRESHOLD);
          } else {
            query = query.lt('thrower.credit_score', CREDIT_THRESHOLD);
          }

          query = query.or('expires_at.is.null,expires_at.gt.now()');
          query = query.order('created_at', { ascending: false });

          const { data, error: queryError } = await query;

          if (queryError || !data) {
            return [];
          }

          return data as unknown as BottleCandidate[];
        };

        for (let attempt = 0; attempt < FISH_BOTTLE_RETRY_COUNT; attempt++) {
          let candidates = await fetchCandidates(isHighCredit);

          if (candidates.length === 0 && isHighCredit && attempt === 0) {
            candidates = await fetchCandidates(false);
          }

          if (candidates.length === 0) {
            const errMsg = '星海暂时没有漂流瓶，稍后再来吧';
            setError(errMsg);
            return { success: false, error: errMsg };
          }

          const selected = weightedRandomSelect(candidates);

          const updateData = {
            status: 'fished' as const,
            fisher_id: user.id,
          };

          const { data: updatedBottle, error: updateError } = await supabase
            .from('bottles')
            .update(updateData)
            .eq('id', selected.id)
            .eq('status', 'floating')
            .select()
            .single();

          if (updateError || !updatedBottle) {
            if (attempt < FISH_BOTTLE_RETRY_COUNT - 1) {
              continue;
            }
            const errMsg = '捞瓶失败，请稍后重试';
            setError(errMsg);
            return { success: false, error: errMsg };
          }

          const { data: throwerData } = await supabase
            .from('users')
            .select('credit_score')
            .eq('id', selected.thrower_id)
            .single();

          const throwerCreditScore = throwerData
            ? (throwerData as { credit_score: number }).credit_score
            : selected.thrower.credit_score;

          if (isBottle(updatedBottle)) {
            return {
              success: true,
              bottle: updatedBottle,
              throwerCreditScore,
            };
          }

          return {
            success: true,
            bottle: updatedBottle as unknown as Bottle,
            throwerCreditScore,
          };
        }

        const errMsg = '网络繁忙，请稍后重试';
        setError(errMsg);
        return { success: false, error: errMsg };
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '捞瓶失败，请稍后重试';
        setError(errMsg);
        return { success: false, error: errMsg };
      } finally {
        setIsFishing(false);
      }
    },
    []
  );

  return {
    isThrowing,
    isFishing,
    error,
    throwBottle,
    fishBottle,
  };
}
