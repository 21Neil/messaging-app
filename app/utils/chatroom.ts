import type { Member } from '~/services/chatroom-services';

const getRoomName = (members: Member[], id: number) => {
  return members?.find(member => member.id !== id)?.name || '未成功取得名稱';
};

const chatroomUtils = {
  getRoomName
}

export default chatroomUtils
