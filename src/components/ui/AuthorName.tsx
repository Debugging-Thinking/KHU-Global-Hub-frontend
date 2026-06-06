import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

/**
 * 작성자 이름. authorId가 있으면(비익명) 탭하면 프로필로 이동한다.
 * 단, 링크처럼 꾸미지 않고 일반 텍스트와 동일하게 보인다(탭만 가능).
 */
export function AuthorName({
  name,
  authorId,
  onPress,
  style,
}: {
  name: string;
  authorId: number | null | undefined;
  onPress: (id: number) => void;
  style?: StyleProp<TextStyle>;
}) {
  if (authorId == null) {
    return <Text style={style}>{name}</Text>;
  }
  return (
    <Text style={style} onPress={() => onPress(authorId)} suppressHighlighting>
      {name}
    </Text>
  );
}
