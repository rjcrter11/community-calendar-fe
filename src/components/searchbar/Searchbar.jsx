import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {
  searchbar,
  searchbarInput,
  searchbarInputLarge,
  large,
  searchbarInputSmall,
} from './Searchbar.module.scss'
import {useHistory} from 'react-router-dom'
import {buildQS} from '../../utils'
import {SearchIcon} from 'icons'

const Searchbar = ({isLarge, cb, filters = null}) => {
  const [searchText, setSearchText] = useState('')
  const rccHistory = useHistory()

  const handleChange = e => {
    setSearchText(e.target.value)
  }

  const handleSearch = () => {
    //encode text and filters to query string
    let qsObj = {
      searchText,
    }

    // if filters exist flatten into new object
    if (filters) {
      // if "tags" exist add to qs
      if (filters.tags) {
        filters.tags.forEach((tag, ind) => {
          qsObj[`tag${ind}`] = tag
        })
      }
      // if "locations" exist add to qs
      if (filters.location) {
        Object.keys(filters.location).forEach(k => {
          if (!/^__typename/.test(k)) qsObj[k] = filters.location[k]
        })
      }
      // if "dateRange" exist add to qs
      if (filters.dateRange) {
        Object.keys(filters.dateRange).forEach(k => {
          if (!/^__typename/i.test(k)) qsObj[k] = filters.dateRange[k]
        })
      }
      // if "ticketPrice" exist add to qs
      if (filters.ticketPrice) {
        filters.ticketPrice.forEach((priceRange, ind) => {
          qsObj[`minPrice-${ind}`] = priceRange.minPrice
          qsObj[`maxPrice-${ind}`] = priceRange.maxPrice
        })
      }
    }

    console.log('qsObj in Searchbar', qsObj)
    const qs = buildQS(qsObj)
    // push to /search with query string
    rccHistory.push(`/search${qs}`)
    // clear search text
    setSearchText('')
    // execute callback if provided
    cb && cb()
  }

  return (
    <div
      className={`   is-relative ${searchbar} ${
        isLarge ? `${large} is-size-3` : ''
      }`}
    >
      {isLarge && <SearchIcon dimensions={40} />}
      <input
        className={`${searchbarInput} ${
          isLarge ? searchbarInputLarge : searchbarInputSmall
        }`}
        type='text'
        placeholder='Search'
        onChange={e => handleChange(e)}
        value={searchText}
        onKeyDown={e => {
          if (e.keyCode === 13 && searchText.length) {
            handleSearch()
          }
        }}
      />
      <button
        className={`button small-btn  is-primary   ${
          !searchText.length && !isLarge ? 'willFadeIn' : 'fadeIn'
        }`}
        onClick={() => {
          if (searchText.length) handleSearch()
        }}
      >
        Search
      </button>
    </div>
  )
}

Searchbar.propTypes = {
  isLarge: PropTypes.bool,
  cb: PropTypes.func,
}
export default Searchbar
