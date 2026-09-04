import { Avatar, Flex, Modal, ScrollArea, Stack, Text, type ModalProps } from "@mantine/core"
import type { Member } from "~/services/chatroom-services"

interface MembersModalProps extends ModalProps {
  members: Member[];
}

const MembersModal = ({ opened, onClose, members }: MembersModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='成員'
      withCloseButton={false}
      centered
    >
      <ScrollArea h='75vh'>
        {members.map(member => (
          <Flex key={member.id} mb={8} gap={6}>
            <Avatar src={member.avatar} />
            <Stack gap={0} justify="center">
              <Text lh={1.2}>{member.name}</Text>
              <Text lh={1.2} fz={12}>{member.username}</Text>
            </Stack>
          </Flex>
        ))}
      </ScrollArea>
    </Modal>
  )
}

export default MembersModal