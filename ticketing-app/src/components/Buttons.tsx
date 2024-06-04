interface ButtonProp {
  children: string;
  color?: string;
  onPress: () => void;
}

const Buttons = ({ children, color = "primary", onPress }: ButtonProp) => {
  return (
    <button type="button" className={"btn btn-" + color} onClick={onPress}>
      {children}
    </button>
  );
};

export default Buttons;
