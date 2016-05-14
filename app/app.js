import React from "react";
import ReactDOM from "react-dom"
import marked from "marked"
import $ from 'jquery';

var data = null;

var Input = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.state.typed.toString(), {sanitize: true, gfm: true, breaks: true});
    return { __html: rawMarkup };
  },
  getInitialState: function() {
    return {typed: ''};
  },
  onChange: function(event) {
    this.setState({typed: event.target.value});
    var data = event.target.value
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.sendFormData();
  },

  sendFormData: function () {
    var formData = {
      text: this.state.typed
    }
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: formData,
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <textarea onChange={this.onChange} />
          <input type="submit" value="Post" />
        </form>
        <div>
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Input url="/send"/>,
  document.getElementById('content')
);
