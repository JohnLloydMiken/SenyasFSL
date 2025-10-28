import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

type Props = {
  uri: string;
  style: any;
};

const storage = getStorage(); // Make sure firebase is initialized

const FirebaseImage: React.FC<Props> = ({ uri, style }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (uri?.startsWith('gs://')) {
      getDownloadURL(ref(storage, uri))
        .then(setUrl)
        .catch((error) => console.error("Error getting image URL:", error));
    } else {
      setUrl(uri); // It might already be an https URL
    }
  }, [uri]);

  if (!url) {
    return null; // Or a placeholder/loader
  }

  return <Image source={{ uri: url }} style={style} />;
};

export default FirebaseImage;