function selectVisibleMembers(){selectedMemberIds=[...new Set([...selectedMemberIds,...filteredMembers().map(m=>m.id)])];renderMembers()}
