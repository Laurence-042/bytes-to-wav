function concactUint8Array(array0, array1) {
  let res = new Uint8Array(array0.length + array1.length)
  res.set(array0)
  res.set(array1, array0.length)
  return res
}

function generateHeader(
  audioData,
  channels = 2,
  sampleRate = 22050,
  bitsPerSample = 16
) {
  let audioDataLen = audioData.length

  let wavHeader = new Uint8Array(44)
  //ckid：4字节 RIFF 标志，大写
  wavHeader[0] = 'R'.charCodeAt()
  wavHeader[1] = 'I'.charCodeAt()
  wavHeader[2] = 'F'.charCodeAt()
  wavHeader[3] = 'F'.charCodeAt()
  //cksize：4字节文件长度，这个长度不包括"RIFF"标志(4字节)和文件长度本身所占字节(4字节),即该长度等于整个文件长度 - 8
  let totalDataLen = audioDataLen + 36
  wavHeader[4] = totalDataLen & 0xff
  wavHeader[5] = (totalDataLen >> 8) & 0xff
  wavHeader[6] = (totalDataLen >> 16) & 0xff
  wavHeader[7] = (totalDataLen >> 24) & 0xff
  //fcc type：4字节 "WAVE" 类型块标识, 大写
  wavHeader[8] = 'W'.charCodeAt()
  wavHeader[9] = 'A'.charCodeAt()
  wavHeader[10] = 'V'.charCodeAt()
  wavHeader[11] = 'E'.charCodeAt()
  //ckid：4字节 表示"fmt" chunk的开始,此块中包括文件内部格式信息，小写, 最后一个字符是空格
  wavHeader[12] = 'f'.charCodeAt()
  wavHeader[13] = 'm'.charCodeAt()
  wavHeader[14] = 't'.charCodeAt()
  wavHeader[15] = ' '.charCodeAt()
  //cksize：4字节，文件内部格式信息数据的大小，过滤字节（一般为00000010H）
  wavHeader[16] = 0x10
  wavHeader[17] = 0
  wavHeader[18] = 0
  wavHeader[19] = 0
  //FormatTag：2字节，音频数据的编码方式，1：表示是PCM 编码
  wavHeader[20] = 1
  wavHeader[21] = 0
  //Channels：2字节，声道数，单声道为1，双声道为2
  wavHeader[22] = channels
  wavHeader[23] = 0
  //SamplesPerSec：4字节，采样率，如22050
  wavHeader[24] = sampleRate & 0xff
  wavHeader[25] = (sampleRate >> 8) & 0xff
  wavHeader[26] = (sampleRate >> 16) & 0xff
  wavHeader[27] = (sampleRate >> 24) & 0xff
  //BytesPerSec：4字节，音频数据传送速率, 单位是字节。其值为采样率×每次采样大小。播放软件利用此值可以估计缓冲区的大小；
  let bytePerSecond = sampleRate * (bitsPerSample / 8) * channels
  wavHeader[28] = bytePerSecond & 0xff
  wavHeader[29] = (bytePerSecond >> 8) & 0xff
  wavHeader[30] = (bytePerSecond >> 16) & 0xff
  wavHeader[31] = (bytePerSecond >> 24) & 0xff
  //BlockAlign：2字节，每次采样的大小 = 采样精度*声道数/8(单位是字节); 这也是字节对齐的最小单位, 譬如 16bit 立体声在这里的值是 4 字节。
  //播放软件需要一次处理多个该值大小的字节数据，以便将其值用于缓冲区的调整
  wavHeader[32] = (bitsPerSample * channels) / 8
  wavHeader[33] = 0
  //BitsPerSample：2字节，每个声道的采样精度; 譬如 16bit 在这里的值就是16。如果有多个声道，则每个声道的采样精度大小都一样的；
  wavHeader[34] = bitsPerSample
  wavHeader[35] = 0
  //ckid：4字节，数据标志符（data），表示 "data" chunk的开始。此块中包含音频数据，小写；
  wavHeader[36] = 'd'.charCodeAt()
  wavHeader[37] = 'a'.charCodeAt()
  wavHeader[38] = 't'.charCodeAt()
  wavHeader[39] = 'a'.charCodeAt()
  //cksize：音频数据的长度，4字节，audioDataLen = totalDataLen - 36 = fileLenIncludeHeader - 44
  wavHeader[40] = audioDataLen & 0xff
  wavHeader[41] = (audioDataLen >> 8) & 0xff
  wavHeader[42] = (audioDataLen >> 16) & 0xff
  wavHeader[43] = (audioDataLen >> 24) & 0xff

  console.log('header')
  console.log(wavHeader)

  return wavHeader
}

function generateData(fileByteArray,fileName) {
  let fileLength = fileByteArray.length

  let encoder = new TextEncoder()
  let fileNameByteArray = encoder.encode(fileName) // encode string as Uint8Array
  console.log(fileNameByteArray)

  let fileInfoData = new Uint8Array(1)
  console.log(fileInfoData)
  fileInfoData[0] = fileNameByteArray.length
  console.log(fileInfoData)
  fileInfoData = concactUint8Array(fileInfoData,fileNameByteArray)
  console.log(fileInfoData)

  let audioDataLen = 1+fileNameByteArray.length+fileLength

  let wavDataPrefix = new Uint8Array(8)

  // 'data'.charCodeAt()
  wavDataPrefix[0] = 'd'.charCodeAt()
  wavDataPrefix[1] = 'a'.charCodeAt()
  wavDataPrefix[2] = 't'.charCodeAt()
  wavDataPrefix[3] = 'a'.charCodeAt()

  // audioDataLen
  wavDataPrefix[4] = audioDataLen & 0xff
  wavDataPrefix[5] = (audioDataLen >> 8) & 0xff
  wavDataPrefix[6] = (audioDataLen >> 16) & 0xff
  wavDataPrefix[7] = (audioDataLen >> 24) & 0xff

  console.log('wavDataPrefix')
  console.log(wavDataPrefix)
  console.log('fileInfoData')
  console.log(fileInfoData)
  console.log('fileByteArray')
  console.log(fileByteArray)

  return concactUint8Array(wavDataPrefix,concactUint8Array(fileInfoData,fileByteArray))
}

function generateWav(fileByteArray,fileName) {
  let header = generateHeader(fileByteArray)
  let data = generateData(fileByteArray,fileName)
  let res = concactUint8Array(header ,data)

  console.log('returned header')
  console.log(header)
  console.log('returned data')
  console.log(data)
  console.log('final data')
  console.log(res)
  return res
}

function getAudioData(wavArrayBuffer){
  let res = new Uint8Array(wavArrayBuffer.slice(44+8))
  return res
}

function getFileData(wavArrayBuffer){
  let audioData = getAudioData(wavArrayBuffer)
  let fileInfoLength = audioData[0]
  let fileNameByteArray = audioData.slice(1,1+fileInfoLength)
  let filByteArraye = audioData.slice(1+fileInfoLength)

  let utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8
  let fileName = utf8decoder.decode(fileNameByteArray)

  console.log('audioData')
  console.log(audioData)
  console.log('fileNameByteArray')
  console.log(fileNameByteArray)
  console.log('filByteArraye')
  console.log(filByteArraye)

  return {
    fileName:fileName,
    fileByteArray:filByteArraye
  }
}

exports.generateWav = generateWav
exports.getAudioData = getAudioData
exports.getFileData = getFileData
