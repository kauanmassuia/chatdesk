import { Button } from "@chakra-ui/react";

interface AccountButtonProps {
  isActive: boolean;
  onClick: () => void;
}

const AccountButton = ({ isActive, onClick }: AccountButtonProps) => {
  return (
    <Button
      w="100%"
      justifyContent="flex-start"
      colorScheme={isActive ? "blue" : "gray"}
      onClick={onClick}
    >
      Conta
    </Button>
  );
};

export default AccountButton;
