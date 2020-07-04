const {
   Button,
   Form,
   FormGroup,
   Input,
   Label,
   Col,
   Card,
   CardHeader,
   CardFooter,
   CardBody,
   CardTitle,
   CardText,
   Alert,
} = Reactstrap
const {
   LineChart,
   Line,
   CartesianGrid,
   XAxis,
   YAxis,
   ResponsiveContainer,
   BarChart,
   Tooltip,
   Legend,
   Bar,
   ComposedChart,
} = Recharts
const { useState, useEffect, Fragment, useMemo } = React

ReactDOM.render(<App />, document.getElementById('root'))

console.log(Reactstrap, 1)

function App(props) {
   return (
      <div>
         <VoteForm></VoteForm>
      </div>
   )
}

function VoteForm() {
   const [alreadyVoted, setAlreadyVoted] = usePersistState(false, 'alreadyVoted')
   console.log(alreadyVoted)

   const [age, setAge] = useState()

   const [result, setResult] = useState()
   const onResultUpdate = e => setResult(e.target.value)

   const [didVote, setDidVote] = useState()
   const onDidVoteUpdate = e => setDidVote(e.target.value)

   const [invalid, setInvalid] = useState({
      age: false,
      result: false,
      didVote: false,
   })
   const checkValidity = () => {
      setInvalid({
         age: !age,
         result: !result,
         didVote: !didVote,
      })
      return age && result && didVote
   }

   const [shouldCheck, setShouldCheck] = useState(false)
   useEffect(() => {
      if (shouldCheck) checkValidity()
   }, [age, result, didVote, shouldCheck])

   const [isLoading, setIsLoading] = useState(false)

   const onSubmit = () => {
      setShouldCheck(true)
      if (!checkValidity()) return 0

      setIsLoading(true)
      axios
         .get(`/api/public/vote?age=${age}&result=${result}&didVote=${didVote}`)
         .then(r => {
            setAlreadyVoted(true)
         })
         .finally(() => setIsLoading(false))
   }

   return (
      <Fragment>
         {alreadyVoted ? (
            <Alert color="success">Вы уже проголосовали, спасибо!</Alert>
         ) : (
            <Card className="vote-form">
               <CardHeader>Мой Бюллетень</CardHeader>
               <CardBody>
                  <Form>
                     <FormGroup row>
                        <Label for="age" sm={4}>
                           Полных лет
                        </Label>
                        <Col sm={4}>
                           <Input
                              type="number"
                              name="email"
                              id="age"
                              value={age}
                              onChange={e => setAge(e.target.value)}
                              invalid={invalid.age}
                           />
                        </Col>
                     </FormGroup>
                     <FormGroup row>
                        <Label className="col-form-label col-sm-4 pt-0" invalid>
                           Моя позиция
                        </Label>
                        <Col sm={7}>
                           <FormGroup check>
                              <Input
                                 type="radio"
                                 name="result"
                                 value="1"
                                 onChange={onResultUpdate}
                                 invalid={invalid.result}
                                 id="result1"
                              />
                              <Label check for="result1">
                                 За
                              </Label>
                           </FormGroup>
                           <FormGroup check invalid>
                              <Input
                                 type="radio"
                                 name="result"
                                 value="2"
                                 onChange={onResultUpdate}
                                 invalid={invalid.result}
                                 id="result2"
                              />
                              <Label check for="result2">
                                 Против
                              </Label>
                           </FormGroup>
                        </Col>
                     </FormGroup>
                     <FormGroup>
                        <Label for="didVote">Голосовали ли Вы в период с 25 июня по 1 июля?</Label>
                        <FormGroup check>
                           <Input
                              id="didVote1"
                              type="radio"
                              name="didVote"
                              value="1"
                              onChange={onDidVoteUpdate}
                              invalid={invalid.didVote}
                           />
                           <Label check for="didVote1">
                              Да
                           </Label>
                        </FormGroup>
                        <FormGroup check>
                           <Input
                              id="didVote2"
                              type="radio"
                              name="didVote"
                              value="2"
                              onChange={onDidVoteUpdate}
                              invalid={invalid.didVote}
                           />
                           <Label check for="didVote2">
                              Нет
                           </Label>
                        </FormGroup>
                     </FormGroup>
                     <Button color="primary" onClick={onSubmit} disabled={isLoading}>
                        Отправить
                     </Button>
                  </Form>
               </CardBody>
            </Card>
         )}
         {!!alreadyVoted && <Chart />}
      </Fragment>
   )
}

function Chart() {
   const [isLoading, setIsLoading] = useState(false)

   const [groupInterval, setGroupInterval] = usePersistState(5, 'groupInterval')
   const [rawData, setData] = useState([])

   useEffect(() => {
      setIsLoading(true)
      axios
         .get('/api/public/votes')
         .then(r => {
            setData(r.data.votes)
         })
         .finally(() => setIsLoading(false))
   }, [])

   const data = useMemo(() => {
      let totals = {}

      //debugger
      for (let i = 0; i < rawData.length; i++) {
         const d = rawData[i]

         let int = Math.floor(d.age / groupInterval)
         if (!totals[int])
            totals[int] = {
               for: 0,
               against: 0,
            }

         if (d.result == 1) totals[int].for++
         else totals[int].against++
      }
      for (const key in totals) {
         let e = totals[key]
         let ttl = e.against + e.for
         e.ttl = ttl
         if (ttl > 0) {
            e.against = Math.round((e.against * 100) / ttl)
            e.for = Math.round((e.for * 100) / ttl)
         }
      }

      let res = Object.keys(totals).map(key => {
         let e = totals[key]
         e.name = `${+key * groupInterval}-${(+key + 1) * groupInterval - 1}`
         e.order = key
         return e
      })
      res.sort((a, b) => a.order - b.order)

      return res
   }, [rawData, groupInterval])

   // const data = [
   //    {
   //       name: 'Page A',
   //       uv: 4000,
   //       pv: 2400,
   //       amt: 2400,
   //    },
   // ]
   return (
      <Fragment>
         {!data.length || isLoading ? (
            <div>Загружаем...</div>
         ) : (
            <Fragment>
               <Col>
                  <Label for="groupInterval">Группировка, лет:</Label>
                  <Input
                     className="group-interval ml-3"
                     type="number"
                     id="groupInterval"
                     value={groupInterval}
                     onChange={e => setGroupInterval(+e.target.value)}
                  />
               </Col>

               <div className="text-center">Голосов всего: {rawData.length}</div>
               <ResponsiveContainer width="100%" aspect={5.0 / 3.0}>
                  <ComposedChart data={data} barGap={0}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="name" />
                     <YAxis yAxisId="left" orientation="left" />
                     <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                     <Tooltip />
                     <Legend />
                     <Bar yAxisId="left" dataKey="for" fill="#82ca9d" name="За" />
                     <Bar yAxisId="left" dataKey="against" fill="#ffc658" name="Против" />
                     <Line
                        type="monotone"
                        yAxisId="right"
                        dataKey="ttl"
                        stroke="#8884d8"
                        strokeWidth={1.5}
                        name="Голосов"
                     />
                  </ComposedChart>
               </ResponsiveContainer>
            </Fragment>
         )}
      </Fragment>
   )
}

function usePersistState(defaultValue, keyWithoutPrefix) {
   const LOCALSTORATE_PREFIX = 'popravki2020_'
   let key = LOCALSTORATE_PREFIX + keyWithoutPrefix

   let [value, setValue2] = useState(() => {
      let str = localStorage.getItem(key)

      if (str) {
         try {
            defaultValue = JSON.parse(str)
         } catch (e) {}
      }

      return defaultValue
   })

   const setValue = v => {
      localStorage.setItem(key, JSON.stringify(v))
      setValue2(v)
   }

   return [value, setValue]
}
