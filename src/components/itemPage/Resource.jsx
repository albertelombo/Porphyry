import React, {useState, useEffect} from 'react';

let Resource = React.memo((props) => {

  const EXTENSION = /\.[\w{3,4}]+(?=[?]|$)/;

  const [rights, setRights] = useState(false);
  const [update, setUpdate] = useState(false);
  const [user, setUser] = useState({user: ''});

  let getResourceType = (resource) => {
    if (typeof resource === 'string') {
      try {
        let uri = resource;
        if (/optimized/.test(uri)) return 'image';
        switch (uri.match(EXTENSION)[0]) {
          case '.gif':
          case '.jpg':
          case '.jpeg':
          case '.png':
          case '.svg':
          case '.webp':
            return 'image';
          default: return null;
        }
      } catch (e) {
        return null;
      }
    } else {
      return 'object';
    }
  };

  function requestSession(options) {
    return props.conf.then(x => {
      options = options || {};
      options.credentials = 'include';
      return fetch(x.services[0] + '/_session', options);
    });
  }

  async function handleClick() {
    let isAuthenticate;
    requestSession()
      .then(x => x.json())
      .then(x => setUser({user: x.name || x.userCtx.name}))
      .then(() => {
        if (user.user == '' || user.user == null) {
          isAuthenticate = false;
        } else {
          isAuthenticate = true;
        }
      })
      .then(() => {
        if (isAuthenticate) {
          setRights(true);
        } else {
          console.log('Il faut être authentifié pour avoir les paroles');
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(()=> {
    if (rights) {
      console.log('here we go');
      setUpdate(true);

    }
  }, [rights]);

  let resource = props.resource && props.resource[0];
  if (!resource) return null;
  switch (getResourceType(resource)) {
    case 'image':
      return (
        <div className="p-3">
          <a href={resource} target="_blank" className="cursor-zoom"
            rel="noopener noreferrer">
            <img src={resource} alt="fileName" />
          </a>
        </div>
      );
    case 'object':
      let videoUri = 'https://www.youtube.com/embed/';
      const END = /\=[\w{1,12}]/ ;
      let videoId = resource.lien[0].split(/\=/)[1];
      videoUri = videoUri + videoId;
      return (
        <div className="p-3">
          <iframe width="420" height="315"
            src={videoUri} allowFullScreen>
          </iframe>
          <br />
          {update ? <pre>{resource.lyrics}</pre> : <button onClick={handleClick} className="btn btn-primary">Charger les paroles </button> }
          <br />
          <a href={resource.pic} target="_blank" className="cursor-zoom"
            rel="noopener noreferrer">
            <img src={resource.pic} alt="fileName" />
          </a>
        </div>
      );
    default: return (
      <div className="p-3">
        <a href={resource} className="btn btn-light" >"fileName"</a>
      </div>
    );
  }

});

export default Resource;
