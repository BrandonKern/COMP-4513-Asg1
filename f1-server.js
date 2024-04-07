const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();

const supaUrl = 'https://gpguqnzzbamugsskjpce.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZ3Vxbnp6YmFtdWdzc2tqcGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2NDIxMDAsImV4cCI6MjAyNDIxODEwMH0.NrxelAdhbR2l2s91_rJ0leFtXcw-NzL2Z59PNAyivFg';

const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get('/api/seasons', async (req, res) => {
    const {data, error} = await supabase
        .from('seasons')
        .select();
    if (error) 
        res.json({"message": "error when fetching data"}); 
    res.send(data);
});

app.get('/api/circuits', async (req, res) => {
    const {data, error} = await supabase
        .from('circuits')
        .select();
        if (error) {
            res.json({"message": "error when fetching data"}); 
            return
        }
    res.send(data);
});

app.get('/api/circuits/:ref', async (req, res) => {
    const {data, error} = await supabase
        .from('circuits')
        .select()
        .eq('circuitRef',req.params.ref);
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    } 
    res.send(data);
});

app.get('/api/circuits/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select(`
        *, races!inner()
        `)
        .eq('races.year', req.params.year)
        .order('round', {referencedTable: 'races', ascending: true });
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});

app.get('/api/constructors', async (req, res) => {
    const {data, error} = await supabase
        .from('constructors')
        .select();
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});

app.get('/api/constructors/:ref', async (req, res) => {
    const {data, error} = await supabase
        .from('constructors')
        .select()
        .eq('constructorRef',req.params.ref);
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    } 
    res.send(data);
});

app.get('/api/drivers', async (req, res) => {
    const {data, error} = await supabase
        .from('drivers')
        .select();
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});

app.get('/api/drivers/:ref', async (req, res) => {
    const {data, error} = await supabase
        .from('drivers')
        .select()
        .eq('driverRef',req.params.ref);
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});

app.get('/api/drivers/search/:substring', async (req, res) => {
    const {data, error} = await supabase
        .from('drivers')
        .select()
        .ilike('surname', `${req.params.substring}%`);

    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});

// struggling with this one
app.get('/api/drivers/race/:raceId', async (req, res) => {
    const {data, error} = await supabase
        .from('drivers')
        .select(`
        * , results!inner()
        `)
        .eq('results.raceId',req.params.raceId);
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});


app.get('/api/races/:raceId', async (req, res) => {
    const {data, error} = await supabase
        .from('races')
        .select(`
        raceId, year, round, circuits (name, location, country), name, date, time, url, 
        fp1_date, fp1_time, fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time
        `)
        .eq('raceId',req.params.raceId);
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});

app.get('/api/races/season/:year', async (req, res) => {
    const {data, error} = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .order('round', { ascending: true });
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});


app.get('/api/races/season/:year/:round', async (req, res) => {
    const {data, error} = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .eq('round', req.params.round);
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});


app.get('/api/races/circuits/:ref', async (req, res) => {
    const {data, error} = await supabase
        .from('races')
        .select(`*, circuits!inner()`)
        .eq('circuits.circuitRef', req.params.ref)
        .order('year', { ascending: true });
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});


app.get('/api/races/circuits/:ref/season/:start/:end', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select(`*, circuits!inner()`)
    .eq('circuits.circuitRef', req.params.ref)
    .gte('year', req.params.start)
    .lte('year', req.params.end)
    .order('year', { ascending: true });
if (error) {
    res.json({"message": "error when fetching data"}); 
    return
}
res.send(data);
});


app.get('/api/results/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('results')
    .select(`
    resultId, number, grid, position, positionText, positionOrder, points, laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed,
    statusId, 
    drivers(driverRef, code, forename, surname),
    races(name, round, year, date),
    constructors(name, constructorRef, nationality)
    `)
    .eq('raceId',req.params.raceId)
    .order('grid', { ascending: true });
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});

app.get('/api/results/driver/:ref', async (req, res) => {
    const {data, error} = await supabase
        .from('results')
        .select(`*, races(year), drivers!inner()`)
        .eq('drivers.driverRef', req.params.ref);
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});


app.get('/api/results/driver/:ref/season/:start/:end', async (req, res) => {
    const {data, error} = await supabase
        .from('results')
        .select(`*, drivers!inner(), races!inner(year)`)
        .eq('drivers.driverRef', req.params.ref)
        .gte('races.year', req.params.start)
        .lte('races.year', req.params.end);
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});


app.get('/api/qualifying/:raceId', async (req, res) => {
        const {data, error} = await supabase
        .from('qualifying')
        .select(`
        qualifyId, number,
        drivers (driverRef, code, forename, surname),
        races (name, round, year, date),
        constructors (name, constructorRef, nationality),
        position, q1, q2, q3
        `)
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true });
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});


app.get('/api/standings/:raceId/drivers', async (req, res) => {
    const {data, error} = await supabase
        .from('driver_standing')
        .select(`
        driverStandingsId,
        drivers (driverRef, code, forename, surname),
        races!inner(name, round, year, date),
        position, positionText, wins
        `)
        .eq('races.raceId', req.params.raceId)
        .order('position', { ascending: true });
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});

app.get('/api/standings/:raceId/constructors', async (req, res) => {
    const {data, error} = await supabase
        .from('constructor_standing')
        .select(`
        constructorStandingsId,
        races!inner(name, round, year, date),
        constructors(name, constructorRef, nationality),
        points, position, positionText, wins
        `)
        .eq('races.raceId', req.params.raceId)
        .order('position', { ascending: true });
    if (error) {
        res.json({"message": "error when fetching data"}); 
        return
    }
    res.send(data);
});


app.listen(8080, () => {
    console.log('listening on port 8080');
    console.log('http://localhost:8080/api/')
})
