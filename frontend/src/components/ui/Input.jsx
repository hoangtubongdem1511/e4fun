import { forwardRef } from "react";

const Input = forwardRef(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={className} {...rest} />;
});

export default Input;
