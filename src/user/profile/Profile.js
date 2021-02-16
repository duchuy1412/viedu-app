// import React, { useState, useEffect } from "react";
// // import PollList from "../../poll/PollList";
// import { getUserProfile } from "../../util/APIUtils";
// import { Avatar, Tabs, Badge } from "antd";
// import { getAvatarColor } from "../../util/Colors";
// import { formatDate } from "../../util/Helpers";
// import LoadingIndicator from "../../common/LoadingIndicator";
// import "./Profile.css";
// import NotFound from "../../common/NotFound";
// import ServerError from "../../common/ServerError";

// const TabPane = Tabs.TabPane;

// const Profile = (props) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ notFound: false, serverError: false });

//   function loadUserProfile(username) {
//     setLoading(true);

//     getUserProfile(username)
//       .then((response) => {
//         setUser(response);
//         setLoading(false);
//       })
//       .catch((error) => {
//         if (error.status === 404) {
//           setStatus({ ...status, notFound: true });
//           setLoading(false);
//         } else {
//           setStatus({ ...status, serverError: true });
//           setLoading(false);
//         }
//       });
//   }

//   useEffect(() => {
//     const username = props.match.params.username;
//     // loadUserProfile(username);
//   });

//   if (loading) {
//     return <LoadingIndicator />;
//   }

//   if (status.notFound) {
//     return <NotFound />;
//   }

//   if (status.serverError) {
//     return <ServerError />;
//   }

//   const tabBarStyle = {
//     textAlign: "center",
//   };

//   return (
//     <div className="profile">
//       {user ? (
//         <div className="user-profile">
//           <div className="user-details">
//             <div className="user-avatar">
//               <Avatar
//                 className="user-avatar-circle"
//                 style={{
//                   backgroundColor: getAvatarColor(user.name),
//                 }}
//               >
//                 {user.name[0].toUpperCase()}
//               </Avatar>
//             </div>
//             <div className="user-summary">
//               <div className="full-name">{user.name}</div>
//               <div className="username">@{user.username}</div>
//             </div>
//           </div>
//           <div className="user-poll-details">
//             <Tabs
//               defaultActiveKey="1"
//               animated={false}
//               tabBarStyle={tabBarStyle}
//               size="large"
//               className="profile-tabs"
//             >
//               <TabPane tab={`$_{this.state.user.pollCount} Polls`} key="1">
//                 {/* <PollList
//                   username={this.props.match.params.username}
//                   type="USER_CREATED_POLLS"
//                 /> */}
//                 <Badge color="#f50" text="#f50" />
//               </TabPane>
//               <TabPane tab={`$_{this.state.user.voteCount} Votes`} key="2">
//                 {/* <PollList
//                   username={this.props.match.params.username}
//                   type="USER_VOTED_POLLS"
//                 /> */}
//                 <Badge color="#f50" text="#f50" />
//               </TabPane>
//             </Tabs>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default Profile;
