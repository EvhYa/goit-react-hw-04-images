import { useEffect, useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { GlobalStyle } from './GlobalStyle';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getHits } from './getHits';
import { LoadButton } from './Button/Button';
import { Loader } from './Loader/Loader';
import { ImageModal } from './Modal/Modal';

export function App() {
  const [searchRequest, setSearchRequest] = useState('');
  const [pictures, setPictures] = useState([]);
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [tags, setTags] = useState('');

  const onSearchRequestSubmit = request => {
    if (request === searchRequest) {
      return;
    }
    setSearchRequest(request);
    setPictures([]);
    setPage(1);
    setLoadMore(false);
    setLoader(false);
    setLargeImageURL('');
  };

  useEffect(() => {
    if (!searchRequest) {
      return;
    }
    setLoader(true);
    getHits(searchRequest, page)
      .then(response => {
        return (
          setPictures(prev => [...prev, ...response.data.hits]),
          setLoadMore(page < Math.ceil(response.data.totalHits / 12))
        );
      })
      .catch(error => console.log(error.message))
      .finally(() => {
        setLoader(false);
      });
  }, [page, searchRequest]);

  const onLoadMore = () => {
    setPage(prev => prev + 1);
    setLoadMore(false);
  };

  const onShowModal = (largeImageURL, tags) => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
    setTags(tags);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <GlobalStyle />
      <Searchbar onSearchRequestSubmit={onSearchRequestSubmit} />
      {pictures.length > 0 && (
        <ImageGallery pictures={pictures} onShowModal={onShowModal} />
      )}
      {loadMore && <LoadButton onLoadMore={onLoadMore} />}
      {loader && <Loader />}

      <ImageModal
        largeImageURL={largeImageURL}
        tags={tags}
        showModal={showModal}
        onCloseModal={onCloseModal}
      />
    </div>
  );
}
