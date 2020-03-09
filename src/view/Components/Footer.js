import React, { Component } from 'react'

class Footer extends Component {
   constructor(props){
      super(props)
   }
   render(){
      return(
         <footer className="footer">
               <div className="container">
                  <div className="text-center">
                     Copyright © 2018 Dashtreme Admin</div>
               </div>
            </footer>
      )
   }
}
export default Footer;