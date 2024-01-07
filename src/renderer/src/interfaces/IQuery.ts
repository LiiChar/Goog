interface IQueryNextPage {
  title: string
  totalResults: string
  searchTerms: string
  count: number
  startIndex: number
  inputEncoding: string
  outputEncoding: string
  safe: string
  cx: string
}

export interface IQueryItem {
  kind: string
  title: string
  htmlTitle: string
  link: string
  displayLink: string
  snippet: string
  htmlSnippet: string
  cacheId: string
  formattedUrl: string
  htmlFormattedUrl: string
  pagemap: {
    cse_thumbnail: {
      src: string
      width: string
      height: string
    }[]
    metatags: any[]
    cse_image: {
      src: string
    }[]
  }
}

export interface IQuery {
  kind: string
  url: {
    type: string
    template: string
  }
  queries: {
    request: {
      title: string
      totalResults: string
      searchTerms: string
      count: number
      startIndex: number
      inputEncoding: string
      outputEncoding: string
      safe: string
      cx: string
    }[]
    nextPage: IQueryNextPage[]
  }
  context: {
    title: string
  }
  searchInformation: {
    searchTime: number
    formattedSearchTime: string
    totalResults: string
    formattedTotalResults: string
  }
  items: IQueryItem[]
}
