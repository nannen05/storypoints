// import React, { Component } from 'react';
// import { Route, Redirect } from 'react-router-dom'
// import { firebase, auth } from '../firebase';

// const PrivateRoute = ({component: Component, authed, ...rest}) => {

//     let authorize = null

//     // let userAuthed = firebase.auth.currentUser;

//     // firebase.auth.onAuthStateChanged(authUser => {
//     //     if(authUser) {
//     //         authed = true
//     //         console.log('authed')
//     //     }
//     // })

//     return (
//         <Route
//             {...rest}
//             render={
//                 (props) => authed === true
//                 ? <Component {...props} />
//                 : <Redirect to={{pathname: '/login'}} />
//             }
//         />
//     )
// }

// export default PrivateRoute