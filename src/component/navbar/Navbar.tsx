import "./navbar.scss"

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="/middleware.svg" alt=""/>
        <span>Middleware Controller</span>
      </div>
      <div className="icons">
        <div className="user">
          <img src="/fishing.svg" alt="" />
          <span>LKarrie</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar
