import {
  parseCreationOptionsFromJSON,
  supported,
  create,
  parseRequestOptionsFromJSON,
  get,
} from "@github/webauthn-json/browser-ponyfill";
import React from "react";

import "./App.css";

export default class App extends React.PureComponent {
  state = {
    supported: false,
    registerDisplayName: "",
    registerEmail: "",
  };

  componentDidMount(): void {
    this.setState({
      supported: supported(),
    });
  }

  render(): React.ReactNode {
    if (!this.state.supported) {
      return <div>Not Supported</div>;
    }

    return (
      <div className="App">
        <div className="buttons">
          <div className="group">
            <input
              onChange={({ target }) => {
                this.setState({
                  registerEmail: target.value,
                });
              }}
              placeholder="Email"
              type="email"
              value={this.state.registerEmail}
            />
            <input
              onChange={({ target }) => {
                this.setState({
                  registerDisplayName: target.value,
                });
              }}
              placeholder="Display Name"
              type="text"
              value={this.state.registerDisplayName}
            />
            <button onClick={this.register} type="button">
              Register
            </button>
          </div>
          <div className="group">
            <button onClick={this.login} type="button">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  private register = async () => {
    const request = await fetch("/auth/request-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.registerEmail,
        displayName: this.state.registerDisplayName,
      }),
    });

    if (!request.ok) {
      return;
    }

    const authOptions = await request.json();

    try {
      const result = await create(parseCreationOptionsFromJSON(authOptions));
      const response = result.toJSON();

      await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: response.rawId,
          data: response.response.clientDataJSON,
          type: response.type,
        }),
      });
    } catch {
      await fetch("/auth/abort-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challenge: authOptions.publicKey.challenge,
        }),
      });
    }
  };

  private login = async () => {
    const request = await fetch("/auth/request-login", {
      method: "POST",
    });

    if (!request.ok) {
      return;
    }

    const authOptions = await request.json();
    const response = (
      await get(parseRequestOptionsFromJSON(authOptions))
    ).toJSON();

    await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: response.rawId,
        user: response.response.userHandle,
        data: response.response.clientDataJSON,
      }),
    });
  };
}
