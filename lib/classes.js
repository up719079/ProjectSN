class Post {
  constructor(post) {
    this.authorID = post['authorID'];
    this.targetID = post['targetID'];
    this.author = post['author'];
    this.target = post['target'];
    this.created_time = post['time_stamp'];
    this.updated_time = post['update_time'];
    this.contents = post['content'];
    this.targetType = post['targetType'];
    if (this.targetType == 'profile') {
      this.targetUrl = `profile.php?id=${this.authorID}`;
    }
    else {
      this.targetUrl = `group.php?id=${this.targetID}&type=${this.targetType}`;
    }
    this.comments = [];
    if (post['comments']) {
      for (var i = 0; i < post['comments'].length; i++) {
        this.comments.push(new Comment (post['comments'][i]));
      }
    }
  }

  renderComments () {
    var output = ``;
    for(var i=0; i < this.comments.length; i++) {
      output = output + this.comments[i].render();
    }
    //OUTPUT + INPUT NEW COMMENTS?
    return output
  }

  render () {
    var output = `<body>
      <li>
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4><a id="post-author" href="profile.php?${this.authorID}">${this.author}</a> - <a id="post-target" href="${this.targetUrl}">${this.target}</a> - <a id="post-timestamp">${this.created_time}</a></h4>
          </div>
          <div class="panel-body">
            <div class="panel panel-default">
              <div class="panel-body">
                <p id="post-content">
                  ${this.contents}
                </p>
              </div>
            </div>
            <ul id="comments" style="list-style-type: none;">
              ${this.renderComments()}
              <form>
                <div class="form-group">
                  <label for="input-post">Create New Post</label>
                  <textarea class="form-control" rows="3" id="input-post" style="resize:vertical"></textarea>
                </div>
                <div class="form-group">
                  <button type="submit" class="btn btn-default">Submit</button>
                </div>
              </form>
            </ul>
          </div>
        </div>
      </li>
    </body>`;
    return output;
  }
}

class Comment {
  constructor(comment) {
    this.authorID = comment['authorID'];
    this.author = comment['author'];
    this.time_stamp = comment['time_stamp'];
    this.content = comment['content'];
  }

  render () {
    var output = ` <li>
    <body id="comment">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h5><a id="comment-author" href="profile.php?id=${this.authorID}">${this.author}</a> - <a id="comment-time">${this.time_stamp}</a></h4>
        </div>
        <div class="panel-body">
          <p id="comment-content">
            ${this.content}
          </p>
        </div>
      </div>
    </body>
    </li>`;
    return output;
  }
}

//POSSIBLY USEFUL LATER? DISABLE COMMENTS? OTHERWISE DECREPITE
function renderInput () {
  var output = `<html>
    <body>
      <form>
        <div class="form-group">
          <label for="input-post">Create New Post</label>
          <textarea class="form-control" rows="3" id="input-post" style="resize:vertical"></textarea>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-default">Submit</button>
        </div>
      </form>
    </body>
  </html>`
  return output;
}