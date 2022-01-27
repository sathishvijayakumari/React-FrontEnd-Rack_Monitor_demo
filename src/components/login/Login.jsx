// import React, { useState } from 'react';
// import axios from 'axios';

// function Login() {
//    const [username, setUsername] = useState("");
//    const [password, setPassword] = useState("");

//    const submitValue = () => {
//       console.log('========>', username);
//       axios({
//          method: "POST",
//          url: "/api/login",
//          data: { username: username, password: password },
//       })
//          .then((response) => {
//             localStorage.setItem('isLogged', 'success');
//             console.log("response==>", response);
//          })
//          .catch((error) => {
//             console.log('error=====>', error);

//          });
//    }

//    const logout = () => {
//       localStorage.setItem('isLogged', 'failed');
//    }
//    return (
//       <div>
//          <div>
//             <label>UserName : </label>
//             <input name="username"
//                style={{ width: "150px", height: "50px", backgroundColor: "#FFF" }}
//                onChange={(e) => setUsername(e.target.value)}
//                value={username}
//             /><br /><br />

//             <label>password : </label>
//             <input name="password"
//                style={{ width: "150px", height: "50px", backgroundColor: "#FFF" }}
//                onChange={(e) => setPassword(e.target.value)}
//                value={password}
//             /><br /><br />
//             <button onClick={() => submitValue()}>Submit</button><br /><br />
//             <button onClick={() => logout()}>Logout</button>
//          </div>
//       </div>
//    )
// }

// export default Login


import React, { Component } from 'react'
import axios from 'axios';
import login from '../../styling/login.module.css';


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export default class Login extends Component {
   constructor(props) {
      super(props)
      this.state = {
         username: '',
         password: '',
         message: true,
         error: false,
         showpwd: false,
      }
   }
   inputHandler = (event) => {
      this.setState({ [event.target.name]: event.target.value })
   }

   login = (event) => {
      event.preventDefault();
      console.log(this.state);
      if (this.state.username && this.state.password) {
         axios({
            method: "POST",
            url: "/api/login",
            data: { username: this.state.username, password: this.state.password },
         })
            .then((response) => {
               console.log("response==>", response);
               localStorage.setItem("isLogged", "success")
               this.props.parentCallback("success")
            })
            .catch((error) => {
               console.log('error=====>', error);
               if (error.response.status === 403) {
                  this.setState({ error: true, message: 'User session had timed out. Please login again.' });
               } else {
                  this.setState({ error: true, message: 'Unauthorized' });
               }
               localStorage.setItem("isLogged", "failed")
               this.props.parentCallback("failed")
            });
      }
      else {
         this.setState({ error: true, message: 'Login Failed' });
         console.log('Failed..');
      }
   }

   render() {
      const { error, message } = this.state;
      return (
         <div className={login.login_container}>
            <img src="../images/serverwallpaper.jpg" alt="" />
            <div className={login.form_align}>
               {error && (
                  <div className="alert alert-danger">
                     <strong>Error!</strong> {message}
                  </div>
               )}
               <form onSubmit={this.login} className="form-group">
                  {/* <h3 style={{ textAlign: 'center', color: '#FFF', fontFamily: 'serif', fontWeight: 'bold' }}>LOGIN</h3> */}

                  <div className="mt-1">
                     <label htmlFor="username" style={{ color: '#FFF', fontFamily: 'serif', fontWeight: 'bold', fontSize: '20px' }}>Username </label>
                     <input type="text" className={login.text_input}
                        id="username" required name="username" onChange={this.inputHandler} />
                  </div>

                  <div className="mt-2">
                     <label htmlFor="password" style={{ color: '#FFF', fontFamily: 'serif', fontWeight: 'bold', fontSize: '20px' }}>Password </label>
                     <input type={this.state.showpwd ? "text" : "password"}
                        className={login.text_input} required
                        id="password" name="password" onChange={this.inputHandler} />
                  </div>

                  <div className="form-check mt-3">
                     <input type="checkbox" className="form-check-input" id="showpwd" name="showpwd" onChange={() => this.setState({ showpwd: !this.state.showpwd })} />
                     <label style={{ color: '#FFF', fontFamily: 'serif', fontWeight: 'bold', fontSize: '18px' }} className="form-check-label" htmlFor="showpwd">Show Password</label>
                  </div>

                  <div className="mt-3 text-center">
                     <button type="submit" className={login.button}>Login</button>
                  </div>
               </form>

            </div>
         </div>
      )
   }
}
