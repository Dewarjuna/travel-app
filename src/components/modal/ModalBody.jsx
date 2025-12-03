const ModalBody = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 sm:px-8 sm:py-6 ${className}`}>{children}</div>
  );
};

export default ModalBody;