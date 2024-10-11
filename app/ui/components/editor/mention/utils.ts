export const getMentionedUserIds = (string: string) => {
   const matches = string.matchAll(/userid="([^"]+)"/g)
   return [...matches].map((match) => match[1])
}
