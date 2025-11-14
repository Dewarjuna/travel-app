const Button = ({ 
  children, 
  onClick, 
  loading = false, 
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
return (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`
            relative px-6 py-4
            bg-linear-to-b from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700 
            text-white font-bold text-lg rounded-lg 
            shadow-[0_4px_0_0_rgb(29,78,216),0_8px_16px_-2px_rgba(37,99,235,0.4)]
            hover:shadow-[0_2px_0_0_rgb(29,78,216),0_6px_12px_-2px_rgba(37,99,235,0.5)]
            hover:-translate-y-0.5
            active:translate-y-0.5 
            active:shadow-[0_0_0_0_rgb(29,78,216),inset_0_3px_8px_rgba(0,0,0,0.3)]
            transition-all duration-150 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
            disabled:shadow-none
            ${fullWidth ? 'w-full' : ''}
        `}
        {...props}
    >
        {loading ? 'Loading...' : children}
    </button>
);
};

export default Button;