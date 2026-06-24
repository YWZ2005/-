import type { ExchangeItem } from '@/types';

export const EXCHANGE_ITEMS: ExchangeItem[] = [
  {
    id: 'fish_boost',
    name: '捞瓶加速卡',
    description: '下次捞瓶必得高匹配度瓶子',
    cost: 50,
    icon: '⚡',
    category: 'boost',
  },
  {
    id: 'skin_glass',
    name: '琉璃瓶皮肤',
    description: '晶莹剔透的琉璃瓶皮肤',
    cost: 200,
    icon: '🏺',
    category: 'skin',
  },
  {
    id: 'skin_moon',
    name: '月光瓶皮肤',
    description: '散发月光的神秘瓶皮肤',
    cost: 500,
    icon: '🌙',
    category: 'skin',
  },
  {
    id: 'effect_handwrite',
    name: '手写体特效',
    description: '手写风格的文字效果',
    cost: 100,
    icon: '✍️',
    category: 'effect',
  },
  {
    id: 'effect_starlight',
    name: '星海粒子特效',
    description: '星海粒子漂浮效果',
    cost: 300,
    icon: '✨',
    category: 'effect',
  },
];
