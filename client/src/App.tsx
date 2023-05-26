import {
  parseCreationOptionsFromJSON,
  supported,
  create
} from '@github/webauthn-json/browser-ponyfill';
import React from 'react';

import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <div className="buttons">
//         <button type="button">Register</button>
//         <button type="button">Login</button>
//         <button type="button">Logout</button>
//       </div>
//     </div>
//   );
// }

export default class App extends React.PureComponent {
  componentDidMount(): void {
    console.log(supported());
  }

  render(): React.ReactNode {
    return (
      <div className="App">
        <div className="buttons">
          <button onClick={this.register} type="button">
            Register
          </button>
          <button type="button">Login</button>
          <button type="button">Logout</button>
        </div>
      </div>
    );
  }

  private register = async () => {
    const cco = parseCreationOptionsFromJSON({
      publicKey: {
        challenge: '9YMCqe6NjpiFXQQQ1JCZtLzGMZsjUkxcsA7E5eRfp9Q', //  random 32 base64url
        rp: { name: 'raresdesigns.com' },
        user: {
          id: 'YThiMzJjNTgtY2ZiOS00NzAyLThjNDYtNWQ0NzJhODJlYTEw', //  user id in base64url
          name: 'test_user',
          displayName: 'Test User'
        },
        pubKeyCredParams: [],
        // excludeCredentials: registeredCredentials(),
        authenticatorSelection: {
          userVerification: 'preferred'
        },
        extensions: {
          credProps: true
        }
      }
    });

    console.log(await create(cco));
  };
}
