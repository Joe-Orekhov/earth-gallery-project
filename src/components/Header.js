import react from "react"

  function Header({ selectUser }){
  
  return(
    <div id="header">
        <h1>{`Welcome to ${selectUser.toString()}'s Art Gallaery`}</h1>
    </div>

  )
}

export default Header;