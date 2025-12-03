const ModalFooter = ({ children, className = '' }) => {
  return (
    <div
      className={`sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default ModalFooter;