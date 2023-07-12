import React from 'react'

const SearchResult = ({ document }) => {
  return (
    <div className="document-container">
      <div className="document-info">
        <div className="document-title">
          {document._source.title}
        </div>
        <div className="document-score">
          Score: {document._score}
        </div>
      </div>
      <div>
        <p className="document-content">{document._source.content.substring(0, 130)}...</p>
      </div>
    </div>
  )
}

export default SearchResult