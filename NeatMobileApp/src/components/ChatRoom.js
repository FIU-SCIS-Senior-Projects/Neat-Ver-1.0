import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    this.onSend = this.onSend.bind(this);
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello student',
          createdAt: new Date(Date.now()),
          user: {
            _id: 2,
            name: 'Neat Help',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      //TODO: This is where we send a message to ChatBot API
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  onReceive(text) {
    this.setState((previousState) => {
      //TODO: This is where a message needs to be sent to ChatBot API
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

module.exports = ChatRoom;