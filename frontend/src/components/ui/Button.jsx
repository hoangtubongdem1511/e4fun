export default function Button({
  type = "button",
  disabled,
  className,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}

