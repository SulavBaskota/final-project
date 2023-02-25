export const buttonStyles = (theme) => ({
  display: "block",
  width: "100%",
  padding: theme.spacing.xs,
  borderRadius: theme.radius.sm,
  color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

  "&:hover": {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
});
