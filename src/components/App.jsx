import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { GlobalStyle } from './GlobalStyle';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getHits } from './getHits';
import { LoadButton } from './Button/Button';
import { Loader } from './Loader/Loader';
import { ImageModal } from './Modal/Modal';

export class App extends Component {
  state = {
    searchRequest: '',
    pictures: [],
    page: 1,
    loadMore: false,
    loader: false,
    showModal: false,
    largeImageURL: '',
    tags: '',
  };

  onSearchRequestSubmit = request => {
    this.setState({
      searchRequest: request,
      pictures: [],
      page: 1,
      loadMore: false,
      loader: false,
      largeImageURL: '',
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchRequest !== this.state.searchRequest ||
      prevState.page !== this.state.page
    ) {
      this.setState({ loader: true });
      getHits(this.state.searchRequest, this.state.page)
        .then(response => {
          return this.setState(prevState => ({
            pictures: [...prevState.pictures, ...response.data.hits],
            loadMore: this.state.page < Math.ceil(response.data.totalHits / 12),
          }));
        })
        .catch(error => console.log(error.message))
        .finally(() => this.setState({ loader: false }));
    }
  }

  onLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
      loadMore: false,
    }));
  };

  onShowModal = (largeImageURL, tags) => {
    this.setState({
      showModal: true,
      largeImageURL,
      tags,
    });
  };

  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <div>
        <GlobalStyle />
        <Searchbar onSearchRequestSubmit={this.onSearchRequestSubmit} />
        {this.state.pictures.length > 0 && (
          <ImageGallery
            pictures={this.state.pictures}
            onShowModal={this.onShowModal}
          />
        )}
        {this.state.loadMore && <LoadButton onLoadMore={this.onLoadMore} />}
        {this.state.loader && <Loader />}

        <ImageModal
          largeImageURL={this.state.largeImageURL}
          tags={this.state.tags}
          showModal={this.state.showModal}
          onCloseModal={this.onCloseModal}
        />
      </div>
    );
  }
}
