<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->

    <input
      type="file"
      label="选择待处理文件"
      @change="inputFile=$event.target.files[0];process()"
    />

    <div>
      <input type="radio" id="in" value="in" v-model="processMode" @change="process" />
      <label for="in">将文件写入wav</label>
      <br />
      <input type="radio" id="out" value="out" v-model="processMode" @change="process" />
      <label for="out">从wav中读出文件</label>
      <!-- <br />
      <span>Picked: {{ picked }}</span> -->
    </div>

    <a
      v-if="outputFileUrl.length !== 0"
      :download="outputFileName"
      :href="outputFileUrl"
      rel="noopener"
      >{{ outputFileName }}</a
    >
  </div>
</template>

<script>
import WavGenerator from './util/WavGenerator'

export default {
  name: 'App',
  data: () => ({
    inputFile: null,
    processMode: 'in',
    outputFileName: '',
    outputFileUrl: '',
  }),
  mounted() {},
  methods: {
    process() {
      switch (this.processMode) {
        case 'in':
          this.getWav(this.inputFile)
          break
        case 'out':
          this.getFile(this.inputFile)
          break
      }
    },
    getWav(file) {
      let reader = new FileReader()
      reader.readAsArrayBuffer(file)

      reader.onload = (e) => {
        let wavAudioData = new Uint8Array(e.target.result)
        let wavData = WavGenerator.generateWav(wavAudioData,file.name)
        let wavBlob = new Blob([wavData])

        this.getFileDownloadData(wavBlob, 'hello.wav')
      }
    },
    getFile(wav) {
      let reader = new FileReader()
      reader.readAsArrayBuffer(wav)

      reader.onload = (e) => {
        let fileData = WavGenerator.getFileData(e.target.result)
        let fileBlob = new Blob([fileData.fileByteArray])

        this.getFileDownloadData(fileBlob, fileData.fileName)
      }
    },
    getFileDownloadData(blob, fileName) {
      this.outputFileName = fileName
      this.outputFileUrl = window.URL.createObjectURL(blob)
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
