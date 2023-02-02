import { Avatar, Box, Stack } from "@chakra-ui/react";
import React from "react";

const Members = ({ members }) => {
  return (
    <Stack maxW="sm" m="auto" spacing={3}>
      {members.map((m) => (
        <Box key={m.id}>
          <Stack
            p={2}
            className="border border-purple-400 rounded-lg shadow-sm"
            direction="row"
            justifyContent="space-evenly"
            alignItems="center">
            <Avatar src={m.image} name={m.name} />
            <Stack>
              <span className="text-base font-medium">{m.name}</span>
              <span className="text-blue-700 cursor-pointer">{m.email}</span>
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default Members;
