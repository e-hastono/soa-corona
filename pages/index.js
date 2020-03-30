import Head from 'next/head'
import React from 'react'
import axios from 'axios'
import { Doughnut, Line } from 'react-chartjs-2'

import Parser from 'rss-parser'

const parser = new Parser()

export default class Index extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      globalData: null,
      indonesiaData: null,
      globalNewsData: null,
      indonesiaNewsData: null,
    }

    this.getGlobalData = this.getGlobalData.bind(this)
    this.getIndonesiaData = this.getIndonesiaData.bind(this)
    this.getGlobalNewsData = this.getGlobalNewsData.bind(this)
    this.getIndonesiaNewsData = this.getIndonesiaNewsData.bind(this)
  }

  getGlobalData = () => {
    axios({
      method: "GET",
      url: `https://api.covid19api.com/summary`
    })
      .then(res => {
        const top5Data = res.data.Countries.sort((a, b) => (a.TotalConfirmed < b.TotalConfirmed ? 1 : -1)).slice(0, 5)

        this.setState({
          globalData: {
            labels: top5Data.map(datum => datum.Country),
            datasets: [{
              data: top5Data.map(datum => datum.TotalConfirmed),
              backgroundColor: [
                '#BB4041',
                '#D76735',
                '#EA8C2C',
                '#1B2966',
                '#280A4A',
              ],
            }]
          }
        })
      })
  }

  getIndonesiaData = () => {
    axios({
      method: "GET",
      url: `https://api.covid19api.com/country/indonesia/status/confirmed`
    })
      .then(res => {
        console.log(res.data)
        this.setState({
          indonesiaData: {
            labels: res.data.map(datum => new Date(datum.Date).toString().substr(4, 11)),
            datasets: [
              {
                label: 'Confirmed Cases',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: res.data.map(datum => datum.Cases)
              }
            ],
          }
        })
      })
  }

  getGlobalNewsData = () => {
    parser.parseURL("https://cors-anywhere.herokuapp.com/" + 'http://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml', (err, feed) => {
      if (err) console.log(err);
      this.setState({ globalNewsData: feed })

      // console.log(feed.title);
      // feed.items.forEach(function (entry) {
      //   console.log(entry);
      // })
    })
  }

  getIndonesiaNewsData = () => {
    parser.parseURL("https://cors-anywhere.herokuapp.com/" + 'https://rss.kontan.co.id/news/nasional', (err, feed) => {
      if (err) console.log(err);
      this.setState({ indonesiaNewsData: feed })
    })
  }

  componentDidMount() {
    this.getGlobalData()
    this.getIndonesiaData()
    this.getGlobalNewsData()
    this.getIndonesiaNewsData()
  }

  render() {
    return (
      <div className="container">
        <Head>
          <title>Corona Dashboard - TK1 Team 2 SOA</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="text-center my-5">
          <h1 className="title">
            Corona Dashboard
          </h1>

          <p className="description">
            Created to fulfill TK1 Service Oriented Architecture
          </p>

          <div className="card mb-3">
            <div className="card-header">
              <h3>Top 10 Countries with Most Cases</h3>
            </div>
            <div className="card-body">
              {this.state.globalData &&
                <Doughnut data={this.state.globalData} />}
            </div>
          </div>


          <div className="card mb-3">
            <div className="card-header">
              <h3>Confirmed Cases in Indonesia</h3>
            </div>
            <div className="card-body">
              {this.state.indonesiaData &&
                <Line data={this.state.indonesiaData} />}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header">
                  <h3>World News</h3>
                </div>
                <div className="card-body">
                  {this.state.globalNewsData &&
                    <span>
                      <h4>{this.state.globalNewsData.title}</h4>
                      {this.state.globalNewsData.items.slice(0, 10).map(news => (
                        <div className="card" key={news.guid}>
                          <div className="card-body">
                            <h5 className="card-title">{news.title}</h5>
                            <p className="card-text">{news.contentSnippet}</p>
                            <a href={news.link} target="_blank" className="btn btn-danger">Read</a>
                          </div>
                        </div>
                      ))}
                    </span>
                  }
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-header">
                  <h3>Indonesia News</h3>
                </div>
                <div className="card-body">
                  {this.state.indonesiaNewsData &&
                    <span>
                      <h4>{this.state.indonesiaNewsData.title}</h4>
                      {this.state.indonesiaNewsData.items.slice(0, 10).map(news => (
                        <div className="card" key={news.guid}>
                          <div className="card-body">
                            <h5 className="card-title">{news.title}</h5>
                            <p className="card-text">{news.contentSnippet}</p>
                            <a href={news.link} target="_blank" className="btn btn-danger">Read</a>
                          </div>
                        </div>
                      ))}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center mb-5">
          <label>Team 2 MTI Binus 1822 - Bimandika Hasanah - Emmanoel Pratama Putra Hastono - Kristanto - Muhuji Amin - Rezki Saputra</label>
        </footer>
      </div>
    )
  }
}
