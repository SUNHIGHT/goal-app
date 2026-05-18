import './Input.css'

type InputProps =
  React.ComponentPropsWithoutRef<"input">;

export default function Input({
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`input ${className}`}
      {...props}
    />
  );
}