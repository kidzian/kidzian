// useKidzianLogo.js (or logo-component.js)

const LogoGenerator = ({ size = 40, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg"
        style={{ width: size, height: size }}
      >
        <div className="text-white font-bold" style={{ fontSize: size * 0.3 }}>
          K
        </div>
      </div>
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 opacity-20 animate-pulse"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

export default LogoGenerator
