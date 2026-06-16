const AuthFormCard = ({ children, title, subtitle }) => {
  return (
    <div className="w-full max-w-75 sm:max-w-85">

      <div className="bg-white p-3 sm:p-5 rounded-xl border-2 sm:border-[3px] border-[#323E48] shadow-[3px_3px_0px_#323E48]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <img
            src="/logo.png"
            alt="Paylocity Logo"
            className="w-25 h-13 object-contain"
          />
        </div>

        <div className="mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#323E48] mb-0.5">{title}</h2>
          <p className="text-xs text-[#54606b]">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthFormCard;