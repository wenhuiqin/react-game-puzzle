import React, { useEffect, useState } from 'react'
import './game.css'
const image = require('../assets/image.jpg')
interface propsType {
  image: string,
  backgraoundPostion: number[][]
  grid: number,
  initialData: number[][],
  mask: boolean,
  resetGame: Function
}

export default function Game(props: propsType) {
  const [backgraoundPostion, setBackgroundPositions] = useState<number[][]>([])
  const [overlayIndex, setOverlayIndex] = useState<number>()
  const [steps, setSteps] = useState<number>(0)

  useEffect(() => {
    setBackgroundPositions(props.backgraoundPostion)
  }, [props.backgraoundPostion])

  useEffect(() => {
    setSteps(props.grid === 64 ? 75 : 100)
  }, [props.grid])

  useEffect(() => {
    if (JSON.stringify(backgraoundPostion) === JSON.stringify(props.initialData) && props.mask) {
      props.resetGame()
    }
  }, [backgraoundPostion])

  return (
    <div className='contain'
      style={{
        width: Math.sqrt(props.grid) * steps,
        height: Math.sqrt(props.grid) * steps
      }}>
      <div className={props.mask ? "" : "overlay"}></div>
      {
        backgraoundPostion.map((draft, index) => {
          return (
            <div
              key={index}
              className='grid'
              draggable
              style={{
                width: steps,
                height: steps,
                backgroundPositionX: draft[0],
                backgroundPositionY: draft[1],
                backgroundSize: `${Math.sqrt(props.grid) * steps}px ${Math.sqrt(props.grid) * steps}px`,
                backgroundImage: `url(${props.image || image})`
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOverlayIndex(index)
              }}
              onDragEnd={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const copy = JSON.parse(JSON.stringify(backgraoundPostion))
                copy[index] = backgraoundPostion[overlayIndex as number]
                copy[overlayIndex as number] = backgraoundPostion[index]
                setBackgroundPositions(copy)
              }}>
            </div>
          )
        })
      }

    </div>
  )
}
