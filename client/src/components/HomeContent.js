import React, { useContext, useEffect, useState } from 'react'

import { server } from '../config/axios'
import { UserContext } from '../context/UserContext'

import thumbnails from '../image/music-thumbnail.png'

const HomeContent = () => {
  const thumbnail = 'http://localhost:5000/public/thumbnail/'
  const [state] = useContext(UserContext)
  const [isLoading, setLoading] = useState('')
  const [musics, setMusics] = useState()

  useEffect(() => {
    getMusics()
    return () => setMusics()
  }, [])

  const getMusics = async () => {
    try {
      setLoading('loading data...')
      const res = await server.get('/musics')
      setMusics(res?.data.musics)
    } catch (error) {
      console.log(error?.response)
    } finally {
      setLoading('')
    }
  }

  return (
    <main className="lp-body">
      <p className="lpb-title">Dengarkan dan Rasakan</p>
      
      <section className="lpb-wrapper-music">
        { isLoading && <h1 style={{ fontSize: 24, color: '#fff' }}>{ isLoading }</h1> }
        { musics?.map((music, i) => (
            <div className="lpb-card-music" key={ i }>
              <img src={ thumbnail + music.thumbnail} alt="thumbnail-music" className="lpb-card-img" />
              <div className="lpb-music-ty">
                <p className="lpb-title-music">
                  { (music.title.length > 13)? `${music.title.substring(0, 12)}...` : music.title  }
                </p>
                <p>{ music.year }</p>
              </div>
              <p>
                { (music.artist.name.length > 30)? `${music.artist.name.substring(0, 12)}...` : music.artist.name }
              </p>
            </div>
          ))
        }
      </section>
    </main>
  )
}

export default HomeContent