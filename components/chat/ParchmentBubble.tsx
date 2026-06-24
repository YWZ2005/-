import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import KnockAnimation from './KnockAnimation';

interface ParchmentBubbleProps {
  content: string;
  isMe: boolean;
  time: string;
  isRead?: boolean;
  mediaType?: 'text' | 'voice' | 'image' | 'draw' | 'knock';
}

function ParchmentBubble({
  content,
  isMe,
  time,
  isRead = false,
  mediaType = 'text',
}: ParchmentBubbleProps) {
  const bubbleBg = isMe ? '#F5E6D3' : '#E8E0D5';
  const shadowColor = isMe ? '#D4C4A8' : '#C8BFAF';

  const renderContent = () => {
    if (mediaType === 'knock') {
      let knockCount = 1;
      try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed.knockCount === 'number') {
          knockCount = parsed.knockCount;
        }
      } catch {
        knockCount = parseInt(content, 10) || 1;
      }
      return <KnockAnimation count={Math.min(knockCount, 3)} isMe={isMe} />;
    }

    return (
      <Text style={styles.contentText}>{content}</Text>
    );
  };

  return (
    <View style={[styles.container, isMe ? styles.containerRight : styles.containerLeft]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleBg,
            shadowColor: shadowColor,
          },
          isMe ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        <View style={[styles.rollShadowTop, { backgroundColor: shadowColor }]} />
        <View style={styles.contentContainer}>
          {renderContent()}
          <View style={styles.footer}>
            <Text style={styles.timeText}>{time}</Text>
            {isMe && (
              <Text style={[styles.readStatus, isRead && styles.readStatusRead]}>
                ✓✓
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.rollShadowBottom, { backgroundColor: shadowColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    maxWidth: '75%',
  },
  containerRight: {
    alignSelf: 'flex-end',
    paddingLeft: 16,
  },
  containerLeft: {
    alignSelf: 'flex-start',
    paddingRight: 16,
  },
  bubble: {
    borderRadius: 12,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  bubbleRight: {
    borderTopRightRadius: 4,
  },
  bubbleLeft: {
    borderTopLeftRadius: 4,
  },
  rollShadowTop: {
    height: 3,
    opacity: 0.4,
  },
  rollShadowBottom: {
    height: 2,
    opacity: 0.3,
  },
  contentContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  contentText: {
    fontSize: 15,
    color: '#3D2C1E',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#3D2C1E',
    opacity: 0.5,
  },
  readStatus: {
    fontSize: 11,
    color: '#3D2C1E',
    opacity: 0.4,
  },
  readStatusRead: {
    color: '#5BC0BE',
    opacity: 1,
  },
});

export default memo(ParchmentBubble);
