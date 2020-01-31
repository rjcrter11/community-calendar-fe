import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {useDropdown} from '../../utils'

//Components
import Geocoder from 'geocoder/Geocoder'
import {FilterIcon, MapMarkerCircle, DropdownIcon} from 'icons'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import TagInput from 'event_forms/TagInput'

//GQL
import {useQuery, useApolloClient} from '@apollo/react-hooks'
import {GET_CACHE} from '../../graphql'

// Styles
import {filterWrapper, mobile, picker} from './FilterMenu.module.scss'
import {locationContent} from 'navbar/Navbar.module.scss'
import {DateRange} from 'moment-range'

const FilterMenu = props => {
  const {
    setLocation,
    currentLocation,
    setDate,
    currentDate,
    currentTags,
    setTags,
    setPrice010,
    price010,
    setPrice1020,
    price1020,
    setPrice2040,
    price2040,
    setPrice4080,
    price4080,
    setPrice80,
    price80,
  } = props

  const client = useApolloClient()

  const {data: localCache} = useQuery(GET_CACHE)

  // EVENT LOCATION SEARCH HANDLERS
  const [eventSearchAddress, setEventSearchAddress] = useState('')

  // event location dropdown
  const [locationIsOpen, setLocationIsOpen] = useDropdown(fakeCb, false)

  // used by geocoder to update local cache
  function setUserLocation(changes) {
    if (changes.selectedItem) {
      const place = {...changes.selectedItem}
      // apply filter
      console.log('place', place)
      setEventSearchAddress(place.place_name.replace(/united states$/i, 'US'))
      setLocation({
        userLatitude: place.geometry.coordinates[1],
        userLongitude: place.geometry.coordinates[0],
        radius: currentLocation.radius || 30,
      })
    }
  }

  // DATE RANGE SEARCH HANDLERS
  const [searchDateRange, setSearchDateRange] = useState([
    new Date(),
    new Date(),
  ])
  // date dropdown
  const [dateIsOpen, setDateIsOpen] = useDropdown(fakeCb, false)

  const dateRangeChange = newDateRange => {
    setSearchDateRange(newDateRange)
    setDate(newDateRange)
  }

  // TAG SEARCH HANDLERS
  // tags dropdown
  const [tagsIsOpen, setTagsIsOpen] = useDropdown(fakeCb, false)

  // PRICE SEARCH HANDLERS
  // price dropdown
  const [priceIsOpen, setPriceIsOpen] = useDropdown(fakeCb, false)

  // fake cb  for close function
  function fakeCb(e) {
    return
  }

  return (
    <div className={`${filterWrapper} ${props.mobile ? mobile : ''}`}>
      <p className='is-size-4'>Filters</p>
      {/* Select event location filter dropdown menu */}
      <div
        className={`dropdown is-block navDropdown ${
          locationIsOpen ? 'is-active' : ''
        }`}
        data-id='location-geocoder-wrapper'
      >
        <div
          role='button'
          className='dropdown-trigger level is-clickable '
          aria-haspopup='true'
          aria-controls='dropdown-menu2'
          data-testid='location-geocoder-trigger'
          data-id='location-geocoder-trigger'
          onClick={() => setLocationIsOpen(!locationIsOpen)}
        >
          <span className={` is-size-5 no-outline-focus no-pointer-events`}>
            Event Location
          </span>
          <span
            className={`${locationIsOpen ? 'flip' : ''} no-pointer-events icon`}
            style={{transition: 'transform 0.2s'}}
          >
            <DropdownIcon />
          </span>
        </div>
        <div
          className={` dropdown-menu  drop-center ${
            locationIsOpen ? 'is-active' : ''
          }`}
          id='location-dropdown-menu '
          role='menu'
          style={{
            position: 'relative',
            height: `${locationIsOpen ? 'initial' : 0}`,
            paddingTop: 0,
          }}
        >
          <div
            className='dropdown-content '
            data-id='location-geocoder-dropdown'
            style={{boxShadow: 'none', backgroundColor: '#fff', paddingTop: 0}}
          >
            <div
              className={locationContent}
              data-id='location-geocoder-dropdown-content'
            >
              {eventSearchAddress && (
                <p
                  data-id='location-geocoder-address-box'
                  className='level-left'
                  style={{marginBottom: '8px'}}
                >
                  <span data-id='location-geocoder-icon' className='level'>
                    <MapMarkerCircle />
                  </span>
                  <span
                    data-id='location-geocoder-address'
                    style={{marginLeft: '8px'}}
                  >
                    {eventSearchAddress}
                  </span>
                </p>
              )}
              <Geocoder
                labelText='Find Events Near:'
                onSelectedItemChange={setUserLocation}
                dataIdPrefix='location-geocoder'
                isFilterMenu
              />
            </div>
          </div>
          {/* end dropdown-content*/}
          <p className='is-size-5'>Distance</p>
          <div>
            <div>
              <input
                type='radio'
                name='radius'
                id='2'
                onClick={() => setLocation({...currentLocation, radius: 2})}
              />
              <label htmlFor='2' style={{paddingLeft: '1rem'}}>
                Nearby
              </label>
            </div>
            <div>
              <input
                type='radio'
                name='radius'
                id='5'
                onClick={() => setLocation({...currentLocation, radius: 5})}
              />
              <label htmlFor='5' style={{paddingLeft: '1rem'}}>
                5 mi
              </label>
            </div>
            <div>
              <input
                type='radio'
                name='radius'
                id='10'
                onClick={() => setLocation({...currentLocation, radius: 10})}
              />
              <label htmlFor='10' style={{paddingLeft: '1rem'}}>
                10 mi
              </label>
            </div>
            <div>
              <input
                type='radio'
                name='radius'
                id='25'
                onClick={() => setLocation({...currentLocation, radius: 25})}
              />
              <label htmlFor='25' style={{paddingLeft: '1rem'}}>
                25 mi
              </label>
            </div>
            <div>
              <input
                type='radio'
                name='radius'
                id='50'
                onClick={() => setLocation({...currentLocation, radius: 50})}
              />
              <label htmlFor='50' style={{paddingLeft: '1rem'}}>
                50 mi
              </label>
            </div>
          </div>
        </div>
        {/* end dropdown-menu*/}
      </div>{' '}
      {/** End location dropdown */}
      {/* Select event date fiter dropdown menu */}
      <div
        className={`dropdown is-block navDropdown ${
          dateIsOpen ? 'is-active' : ''
        }`}
        data-id='date-picker-wrapper'
      >
        <div
          role='button'
          className='dropdown-trigger level is-clickable '
          aria-haspopup='true'
          aria-controls='dropdown-menu2'
          data-testid='date-picker-trigger'
          data-id='date-picker-trigger'
          onClick={() => setDateIsOpen(!dateIsOpen)}
        >
          <span className={` is-size-5 no-outline-focus no-pointer-events`}>
            Date
          </span>
          <span
            className={`${dateIsOpen ? 'flip' : ''} no-pointer-events icon`}
            style={{transition: 'transform 0.2s'}}
          >
            <DropdownIcon />
          </span>
        </div>
        <div
          className={` dropdown-menu  drop-center ${
            dateIsOpen ? 'is-active' : ''
          }`}
          id='date-dropdown-menu '
          role='menu'
          style={{
            position: 'relative',
            height: `${dateIsOpen ? 'initial' : 0}`,
            paddingTop: 0,
          }}
        >
          <div
            className='dropdown-content '
            data-id='date-picker-dropdown'
            style={{boxShadow: 'none', backgroundColor: '#fff', paddingTop: 0}}
          >
            <div
              className={locationContent}
              data-id='date-picker-dropdown-content'
            >
              <DateRangePicker
                onChange={dateRangeChange}
                value={searchDateRange}
                className={picker}
                calendarIcon={null}
                clearIcon={null}
                minDate={new Date()}
                rangeDivider=' to '
              />
            </div>
          </div>
          {/* end dropdown-content*/}
        </div>
        {/* end dropdown-menu*/}
      </div>{' '}
      {/** end date filter dropdown */}
      {/* Select tag fiter dropdown menu */}
      <div
        className={`dropdown is-block navDropdown ${
          tagsIsOpen ? 'is-active' : ''
        }`}
        data-id='tag-picker-wrapper'
      >
        <div
          role='button'
          className='dropdown-trigger level is-clickable '
          aria-haspopup='true'
          aria-controls='dropdown-menu2'
          data-testid='tag-picker-trigger'
          data-id='tag-picker-trigger'
          onClick={() => setTagsIsOpen(!tagsIsOpen)}
        >
          <span className={` is-size-5 no-outline-focus no-pointer-events`}>
            Tags
          </span>
          <span
            className={`${tagsIsOpen ? 'flip' : ''} no-pointer-events icon`}
            style={{transition: 'transform 0.2s'}}
          >
            <DropdownIcon />
          </span>
        </div>
        <div
          className={` dropdown-menu  drop-center ${
            tagsIsOpen ? 'is-active' : ''
          }`}
          id='tag-dropdown-menu '
          role='menu'
          style={{
            position: 'relative',
            height: `${tagsIsOpen ? 'initial' : 0}`,
            paddingTop: 0,
          }}
        >
          <div
            className='dropdown-content '
            data-id='tag-picker-dropdown'
            style={{boxShadow: 'none', backgroundColor: '#fff', paddingTop: 0}}
          >
            <div
              className={locationContent}
              data-id='tag-picker-dropdown-content'
            >
              <TagInput selectedTags={currentTags} setSelectedTags={setTags} />
            </div>
          </div>
          {/* end dropdown-content*/}
        </div>
        {/* end dropdown-menu*/}
      </div>{' '}
      {/** end tag filter dropdown */}
      {/* Select Price fiter dropdown menu */}
      <div
        className={`dropdown is-block navDropdown ${
          priceIsOpen ? 'is-active' : ''
        }`}
        data-id='price-picker-wrapper'
      >
        <div
          role='button'
          className='dropdown-trigger level is-clickable '
          aria-haspopup='true'
          aria-controls='dropdown-menu2'
          data-testid='price-picker-trigger'
          data-id='price-picker-trigger'
          onClick={() => setPriceIsOpen(!priceIsOpen)}
        >
          <span className={` is-size-5 no-outline-focus no-pointer-events`}>
            Price
          </span>
          <span
            className={`${priceIsOpen ? 'flip' : ''} no-pointer-events icon`}
            style={{transition: 'transform 0.2s'}}
          >
            <DropdownIcon />
          </span>
        </div>
        <div
          className={` dropdown-menu  drop-center ${
            priceIsOpen ? 'is-active' : ''
          }`}
          id='price-dropdown-menu '
          role='menu'
          style={{
            position: 'relative',
            height: `${priceIsOpen ? 'initial' : 0}`,
            paddingTop: 0,
          }}
        >
          <div
            className='dropdown-content '
            data-id='tag-picker-dropdown'
            style={{boxShadow: 'none', backgroundColor: '#fff', paddingTop: 0}}
          >
            <div
              className={locationContent}
              data-id='tag-picker-dropdown-content'
            >
              <div>
                <input
                  type='checkbox'
                  name='010'
                  id='010'
                  onClick={() => setPrice010(!price010)}
                />
                <label htmlFor='010' style={{paddingLeft: '1rem'}}>
                  &#36;0 &#8208; &#36;10
                </label>
              </div>

              <div>
                <input
                  type='checkbox'
                  name='1020'
                  id='1020'
                  onClick={() => setPrice1020(!price1020)}
                />
                <label htmlFor='1020' style={{paddingLeft: '1rem'}}>
                  &#36;10 &#8208; &#36;20
                </label>
              </div>

              <div>
                <input
                  type='checkbox'
                  name='2040'
                  id='2040'
                  onClick={() => setPrice2040(!price2040)}
                />
                <label htmlFor='2040' style={{paddingLeft: '1rem'}}>
                  &#36;20 &#8208; &#36;40
                </label>
              </div>

              <div>
                <input
                  type='checkbox'
                  name='4080'
                  id='4080'
                  onClick={() => setPrice4080(!price4080)}
                />
                <label htmlFor='4080' style={{paddingLeft: '1rem'}}>
                  &#36;40 &#8208; &#36;80
                </label>
              </div>

              <div>
                <input
                  type='checkbox'
                  name='80'
                  id='80'
                  onClick={() => setPrice80(!price80)}
                />
                <label htmlFor='80' style={{paddingLeft: '1rem'}}>
                  &#36;80&#43;
                </label>
              </div>
            </div>
          </div>
          {/* end dropdown-content*/}
        </div>
        {/* end dropdown-menu*/}
      </div>{' '}
    </div>
  )
}

export default FilterMenu
