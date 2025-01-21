import { google } from 'googleapis'
import { unstable_cache } from 'next/cache'

const search = google.customsearch('v1')
const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY
const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID

export const performGoogleImageSearch = async (
  query: string,
  page: string = '1',
) => {
  const imageSearch = async (q: string, page?: string) => {
    if (Number(page) < 1 && Number(page) > 10) {
      throw new Error('Page number must be between 1 and 10')
    }

    console.log('Google image search Cache Miss!!!!!!!!!!!')

    const pageIndex = Number(page) - 1

    return search.cse.list({
      q,
      cx: searchEngineId,
      auth: apiKey,
      // clipart 	Clipart-style images only.
      // face 	Images of faces only.
      // lineart 	Line art images only.
      // stock 	Stock images only.
      // photo 	Photo images only.
      // animated 	Animated images only.
      imgType: 'face',
      searchType: 'image',
      num: 10,
      start: pageIndex * 10 + 1, // 1, 11, 21, 31, 41, 51, 61, 71, 81, 91 - but not more than 100
    }) as unknown as GoogleImageSearchResponse
  }

  const cachedImageSearch = async (query: string, page: string) =>
    unstable_cache(imageSearch, [query, page], {
      revalidate: 60 * 60 * 24,
    })(query, page)

  let response: GoogleImageSearchResponse

  if (query) {
    response = await cachedImageSearch(query, '1')
    console.log('Adding page', 1)
    for (let i = 2; i <= Number(page); i++) {
      console.log('Adding page', i)
      const nthResponse = await cachedImageSearch(query, String(i))
      if (nthResponse.data.items.length === 0) {
        break
      }
      response.data.items = [...response.data.items, ...nthResponse.data.items]
    }
  } else {
    response = {
      data: {
        items: [],
      },
    } as unknown as GoogleImageSearchResponse
  }

  return response
}

export interface GoogleImageSearchResponse {
  config: {
    url: string
    method: string
    apiVersion: string
    userAgentDirectives: Array<{
      product: string
      version: string
      comment: string
    }>
    headers: {
      'x-goog-api-client': string
      'Accept-Encoding': string
      'User-Agent': string
    }
    params: {
      q: string
      cx: string
      imgType: string
      searchType: string
      start: number
      key: string
    }
    retry: boolean
    responseType: string
  }
  data: {
    kind: string
    url: {
      type: string
      template: string
    }
    queries: {
      request: Array<{
        title: string
        totalResults: string
        searchTerms: string
        count: number
        startIndex: number
        inputEncoding: string
        outputEncoding: string
        safe: string
        cx: string
        searchType: string
        imgType: string
      }>
      nextPage: Array<{
        title: string
        totalResults: string
        searchTerms: string
        count: number
        startIndex: number
        inputEncoding: string
        outputEncoding: string
        safe: string
        cx: string
        searchType: string
        imgType: string
      }>
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
    items: Array<{
      kind: string
      title: string
      htmlTitle: string
      link: string
      displayLink: string
      snippet: string
      htmlSnippet: string
      mime: string
      fileFormat: string
      image: {
        contextLink: string
        height: number
        width: number
        byteSize: number
        thumbnailLink: string
        thumbnailHeight: number
        thumbnailWidth: number
      }
    }>
  }
  headers: {
    'alt-svc': string
    connection: string
    'content-encoding': string
    'content-type': string
    date: string
    server: string
    'transfer-encoding': string
    vary: string
    'x-content-type-options': string
    'x-frame-options': string
    'x-xss-protection': string
  }
  status: number
  statusText: string
  request: {
    responseURL: string
  }
}

/*
const googleImageSearchResponse = {
  config: {
    url: 'https://customsearch.googleapis.com/customsearch/v1?q=mike%20benz&cx=31d5b4c9d24e14ea6&imgType=face&searchType=image&start=1&key=AIzaSyDiLTHlhXtO1CdykMyU3DJXWWqIncjq6jI',
    method: 'GET',
    apiVersion: '',
    userAgentDirectives: [
      {
        product: 'google-api-nodejs-client',
        version: '7.2.0',
        comment: 'gzip',
      },
    ],
    headers: {
      'x-goog-api-client': 'gdcl/7.2.0 gl-node/18.20.4',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'google-api-nodejs-client/7.2.0 (gzip)',
    },
    params: {
      q: 'mike benz',
      cx: '31d5b4c9d24e14ea6',
      imgType: 'face',
      searchType: 'image',
      start: 1,
      key: 'AIzaSyDiLTHlhXtO1CdykMyU3DJXWWqIncjq6jI',
    },
    retry: true,
    responseType: 'unknown',
  },
  data: {
    kind: 'customsearch#search',
    url: {
      type: 'application/json',
      template:
        'https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json',
    },
    queries: {
      request: [
        {
          title: 'Google Custom Search - mike benz',
          totalResults: '44700000',
          searchTerms: 'mike benz',
          count: 10,
          startIndex: 1,
          inputEncoding: 'utf8',
          outputEncoding: 'utf8',
          safe: 'off',
          cx: '31d5b4c9d24e14ea6',
          searchType: 'image',
          imgType: 'face',
        },
      ],
      nextPage: [
        {
          title: 'Google Custom Search - mike benz',
          totalResults: '44700000',
          searchTerms: 'mike benz',
          count: 10,
          startIndex: 11,
          inputEncoding: 'utf8',
          outputEncoding: 'utf8',
          safe: 'off',
          cx: '31d5b4c9d24e14ea6',
          searchType: 'image',
          imgType: 'face',
        },
      ],
    },
    context: {
      title: 'Leader Photo search',
    },
    searchInformation: {
      searchTime: 0.293943,
      formattedSearchTime: '0.29',
      totalResults: '44700000',
      formattedTotalResults: '44,700,000',
    },
    items: [
      {
        kind: 'customsearch#result',
        title:
          'Michael Benz, a former Trump State Department official whose work ...',
        htmlTitle:
          '<b>Michael Benz</b>, a former Trump State Department official whose work ...',
        link: 'https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3207915356719537354',
        displayLink: 'www.instagram.com',
        snippet:
          'Michael Benz, a former Trump State Department official whose work ...',
        htmlSnippet:
          '<b>Michael Benz</b>, a former Trump State Department official whose work ...',
        mime: 'image/',
        fileFormat: 'image/',
        image: {
          contextLink: 'https://www.instagram.com/nbcnews/p/CyEzgVKydzK/',
          height: 1350,
          width: 1080,
          byteSize: 150551,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Xyhz9dMgOzxscqpKljaxNbGLOar_Y3ICz8gOOfkpkf7oE0uG2-9rNQ&s',
          thumbnailHeight: 150,
          thumbnailWidth: 120,
        },
      },
      {
        kind: 'customsearch#result',
        title: 'Mike Benz - National Conservatism Conference, Washington 2024',
        htmlTitle:
          '<b>Mike Benz</b> - National Conservatism Conference, Washington 2024',
        link: 'https://nationalconservatism.org/natcon-4-2024/wp-content/uploads/sites/10/2024/05/MV5BMTRjNTU2OGUtYzY0MC00NGY0LWIzMTctYTBiYWI0MDg3OGY3XkEyXkFqcGdeQXVyMDY3OTcyOQ@@._V1_FMjpg_UX1000_.jpg',
        displayLink: 'nationalconservatism.org',
        snippet:
          'Mike Benz - National Conservatism Conference, Washington 2024',
        htmlSnippet:
          '<b>Mike Benz</b> - National Conservatism Conference, Washington 2024',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink:
            'https://nationalconservatism.org/natcon-4-2024/presenters/mike-benz/',
          height: 1000,
          width: 1000,
          byteSize: 53081,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP9lNOxB4mpM64QRaxvIYB8caGS3M_qnUGzorCHJ5KR067nb-mOwuUkdI&s',
          thumbnailHeight: 149,
          thumbnailWidth: 149,
        },
      },
      {
        kind: 'customsearch#result',
        title:
          'Michael Benz, a conservative crusader against online censorship ...',
        htmlTitle:
          '<b>Michael Benz</b>, a conservative crusader against online censorship ...',
        link: 'https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/rockcms/2023-10/231006-mike-benz-frame-game-alt-right-cs-7690fe.jpg',
        displayLink: 'www.nbcnews.com',
        snippet:
          'Michael Benz, a conservative crusader against online censorship ...',
        htmlSnippet:
          '<b>Michael Benz</b>, a conservative crusader against online censorship ...',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink:
            'https://www.nbcnews.com/tech/internet/michael-benz-rising-voice-conservative-criticism-online-censorship-rcna119213',
          height: 630,
          width: 1200,
          byteSize: 56108,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZon5nIgeEXaAx-Zy6ehCw_UKey4k4Cu4b3f3bxUyDi3dG-z_2m_vUX4s&s',
          thumbnailHeight: 79,
          thumbnailWidth: 150,
        },
      },
      {
        kind: 'customsearch#result',
        title:
          'How The US Government Uses Social Media To Censor Free Speech ...',
        htmlTitle:
          'How The US Government Uses Social Media To Censor Free Speech ...',
        link: 'https://i.ytimg.com/vi/N8r8pWTCO4o/maxresdefault.jpg',
        displayLink: 'www.youtube.com',
        snippet:
          'How The US Government Uses Social Media To Censor Free Speech ...',
        htmlSnippet:
          'How The US Government Uses Social Media To Censor Free Speech ...',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink: 'https://www.youtube.com/watch?v=N8r8pWTCO4o',
          height: 720,
          width: 1280,
          byteSize: 105105,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIvqCHwgK-xLK7VBnoWluTHqgY1M7pWm5gDIuUybSRbk9V9t9YdeiF5A&s',
          thumbnailHeight: 84,
          thumbnailWidth: 150,
        },
      },
      {
        kind: 'customsearch#result',
        title:
          'Michael Benz, a conservative crusader against online censorship ...',
        htmlTitle:
          '<b>Michael Benz</b>, a conservative crusader against online censorship ...',
        link: 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/rockcms/2023-10/231006-mike-benz-frame-game-alt-right-cs-7690fe.jpg',
        displayLink: 'www.nbcnews.com',
        snippet:
          'Michael Benz, a conservative crusader against online censorship ...',
        htmlSnippet:
          '<b>Michael Benz</b>, a conservative crusader against online censorship ...',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink:
            'https://www.nbcnews.com/tech/internet/michael-benz-rising-voice-conservative-criticism-online-censorship-rcna119213',
          height: 750,
          width: 1500,
          byteSize: 85705,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEftawLcYResQlu32FCnzXLj2JQi7C6aCNjZ0kqDaOpKbiHzIoyGJ8beg&s',
          thumbnailHeight: 75,
          thumbnailWidth: 150,
        },
      },
      {
        kind: 'customsearch#result',
        title:
          'Unraveling the Web of Internet Freedom: A Candid Conversation with ...',
        htmlTitle:
          'Unraveling the Web of Internet Freedom: A Candid Conversation with ...',
        link: 'https://s3.amazonaws.com/jnswire/jns-media/cb/65/12848009/mikebenzresized.jpg',
        displayLink: 'thefederalnewswire.com',
        snippet:
          'Unraveling the Web of Internet Freedom: A Candid Conversation with ...',
        htmlSnippet:
          'Unraveling the Web of Internet Freedom: A Candid Conversation with ...',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink:
            'https://thefederalnewswire.com/stories/641707686-unraveling-the-web-of-internet-freedom-a-candid-conversation-with-mike-benz-former-diplomat-turned-digital-freedom-advocate',
          height: 480,
          width: 800,
          byteSize: 165307,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTdKtM_pkG1YnUBrZoFcWRlkotQgjNhpS_5QruQI5IlxZ5y2BRgQvvOQ&s',
          thumbnailHeight: 86,
          thumbnailWidth: 143,
        },
      },
      {
        kind: 'customsearch#result',
        title:
          'Michael Benz, a conservative crusader against online censorship ...',
        htmlTitle:
          '<b>Michael Benz</b>, a conservative crusader against online censorship ...',
        link: 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/rockcms/2023-10/231006-mike-benz-frame-game-alt-right-cs-df5b85.jpg',
        displayLink: 'www.nbcnews.com',
        snippet:
          'Michael Benz, a conservative crusader against online censorship ...',
        htmlSnippet:
          '<b>Michael Benz</b>, a conservative crusader against online censorship ...',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink:
            'https://www.nbcnews.com/tech/internet/michael-benz-rising-voice-conservative-criticism-online-censorship-rcna119213',
          height: 620,
          width: 1240,
          byteSize: 54696,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGurTt8VcSMwUwXR9sV7e1ts_d8KgDqyQecG37YAvdHqqCY2udhs4W5TQ&s',
          thumbnailHeight: 75,
          thumbnailWidth: 150,
        },
      },
      {
        kind: 'customsearch#result',
        title: 'Mike Benz (@MikeBenzCyber) (TV Series 2022– ) - IMDb',
        htmlTitle:
          '<b>Mike Benz</b> (@MikeBenzCyber) (TV Series 2022– ) - IMDb',
        link: 'https://m.media-amazon.com/images/M/MV5BNmU2MTVmMmMtNzFiMC00Nzg5LWIyZjUtNzg4YmNmMTg4NThmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        displayLink: 'www.imdb.com',
        snippet: 'Mike Benz (@MikeBenzCyber) (TV Series 2022– ) - IMDb',
        htmlSnippet:
          '<b>Mike Benz</b> (@MikeBenzCyber) (TV Series 2022– ) - IMDb',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink: 'https://www.imdb.com/title/tt29433827/',
          height: 1000,
          width: 1000,
          byteSize: 53356,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Scj9rzY7p5AYQFp9oCY_X7QMo0a4rzvQVIiKrCLAWzvS4KulpU7iR6c&s',
          thumbnailHeight: 149,
          thumbnailWidth: 149,
        },
      },
      {
        kind: 'customsearch#result',
        title:
          'Michael Benz, a conservative crusader against online censorship ...',
        htmlTitle:
          '<b>Michael Benz</b>, a conservative crusader against online censorship ...',
        link: 'https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-10/231006-mike-benz-frame-game-alt-right-cs-df5b85.jpg',
        displayLink: 'www.nbcnews.com',
        snippet:
          'Michael Benz, a conservative crusader against online censorship ...',
        htmlSnippet:
          '<b>Michael Benz</b>, a conservative crusader against online censorship ...',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink:
            'https://www.nbcnews.com/tech/internet/michael-benz-rising-voice-conservative-criticism-online-censorship-rcna119213',
          height: 600,
          width: 1200,
          byteSize: 41656,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0odrjud-U2_Zqj1gpL83fPYt97DVCGSBJmTzXyOeuBMT78qBWVNMRhw&s',
          thumbnailHeight: 75,
          thumbnailWidth: 150,
        },
      },
      {
        kind: 'customsearch#result',
        title: 'Mike Benz (@MikeBenzCyber) (TV Series 2022– ) - IMDb',
        htmlTitle:
          '<b>Mike Benz</b> (@MikeBenzCyber) (TV Series 2022– ) - IMDb',
        link: 'https://m.media-amazon.com/images/M/MV5BNmU2MTVmMmMtNzFiMC00Nzg5LWIyZjUtNzg4YmNmMTg4NThmXkEyXkFqcGc@._V1_QL75_UY281_CR46,0,190,281_.jpg',
        displayLink: 'www.imdb.com',
        snippet: 'Mike Benz (@MikeBenzCyber) (TV Series 2022– ) - IMDb',
        htmlSnippet:
          '<b>Mike Benz</b> (@MikeBenzCyber) (TV Series 2022– ) - IMDb',
        mime: 'image/jpeg',
        fileFormat: 'image/jpeg',
        image: {
          contextLink: 'https://www.imdb.com/title/tt29433827/',
          height: 281,
          width: 190,
          byteSize: 5783,
          thumbnailLink:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ78DnNmVIUEShKmCs_j09hr_KLThGvdXwJE0TfxtBthv19KtCoqFqk&s',
          thumbnailHeight: 114,
          thumbnailWidth: 77,
        },
      },
    ],
  },
  headers: {
    'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
    connection: 'close',
    'content-encoding': 'gzip',
    'content-type': 'application/json; charset=UTF-8',
    date: 'Mon, 20 Jan 2025 15:34:19 GMT',
    server: 'ESF',
    'transfer-encoding': 'chunked',
    vary: 'Origin, X-Origin, Referer',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'SAMEORIGIN',
    'x-xss-protection': '0',
  },
  status: 200,
  statusText: 'OK',
  request: {
    responseURL:
      'https://customsearch.googleapis.com/customsearch/v1?q=mike%20benz&cx=31d5b4c9d24e14ea6&imgType=face&searchType=image&start=1&key=AIzaSyDiLTHlhXtO1CdykMyU3DJXWWqIncjq6jI',
  },
}
  */
