function SendButton(props: any) {
  return (
    <svg
      onClick={props.onClick}
      fill="currentColor"
      viewBox="0 0 24 24"
      height="2rem"
      width="2rem"
      display="inline-block"
      {...props}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
export default SendButton;