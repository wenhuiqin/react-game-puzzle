import React, { useState, useEffect } from 'react'
import { Button, Select, Modal, Input } from 'antd';
import './index.css'
import Game from './game'
const voice = require('../assets/voice.mp3')

export default function App() {
  const [initialData, setInitialData] = useState<number[][]>([])
  const [backgraoundPostion, setBackgroundPositions] = useState<number[][]>([])
  const [selectedOption, setSelectedOption] = useState(9);
  const [selectPic, setSelectPic] = useState("")
  const [mask, setMask] = useState(false)
  const [picModal, setPicModal] = useState(false)
  const setinitialData = () => {
    const initX = 0;
    const initY = 0;
    const steps = selectedOption === 64 ? 75 : 100;
    const lines = Math.sqrt(selectedOption);
    const columns = Math.sqrt(selectedOption);
    const initialData = []
    for (let i = 0; i < lines; i++) {
      for (let j = 0; j < columns; j++) {
        initialData.push([initX - steps * j, initY - steps * i])
      }
    }
    setInitialData(initialData)
    setBackgroundPositions(initialData)
  }

  useEffect(() => {
    setinitialData()
  }, [selectedOption])

  const startGame = () => {
    const maxCount = initialData.length
    const randomArr: number[] = []
    const copy = JSON.parse(JSON.stringify(initialData))
    for (let i = 0; i < maxCount; i++) {
      const randomIndex = Math.floor(Math.random() * maxCount)
      if (randomArr.indexOf(randomIndex) === -1) {
        randomArr.push(randomIndex)
      } else {
        i--;
        continue
      }
    }
    randomArr.map((item, index) => (copy[index] = initialData[item]))
    setMask(true)
    setBackgroundPositions(copy)
  }

  const gridOptins = [
    {
      value: 9,
      label: '9宫格',
    },
    {
      value: 36,
      label: '36宫格',
    },
    {
      value: 64,
      label: '64宫格',
    },
  ]

  const resetGame = () => {
    setinitialData()
    setMask(false)
  }

  const optionOnChange = (value: number) => {
    setSelectedOption(value);
  };

  return (
    <div className='panel'>
      <div>
        {
          mask ? <Button type="primary" className='pretty-button' onClick={resetGame}>
            重置
          </Button> : <Button type="primary" className='pretty-button' onClick={startGame}>
            开始游戏
          </Button>
        }
        <Select
          className='custom-select'
          defaultValue={9}
          disabled={mask}
          options={gridOptins}
          onChange={optionOnChange}
        />
        {
          !mask && <Button
            type="primary"
            className='pretty-button'
            onClick={() => {
              setPicModal(true)
            }}>上传图片</Button>
        }
      </div>
      <Game
        backgraoundPostion={backgraoundPostion}
        image={selectPic}
        grid={selectedOption}
        initialData={initialData}
        mask={mask}
        resetGame={resetGame}
      />
      <Modal
        open={picModal}
        onCancel={() => { setPicModal(false) }}
        title='上传图片 ( 暂时只支持 url )'
        onOk={() => { setPicModal(false) }}>
        <Input.TextArea autoSize value={selectPic} onChange={(e) => {
          setSelectPic(e.target.value)
        }} />
      </Modal>
      <audio controls src={voice} style={{marginTop:10}} loop autoPlay>
        您的浏览器不支持 audio 元素。
      </audio>
    </div>
  )
}
