import React, { useEffect, useState } from 'react';
import { Grid } from 'gridjs-react';
import axios from 'axios';
import { GrRefresh } from "react-icons/gr";

const Info = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllInfo = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:8800/info");
                const responseData = res.data;

                const newData = responseData.map(item => Object.values(item));
                const newColumns = Object.keys(responseData[0]);

                setData(newData);
                setColumns(newColumns);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllInfo();
    }, []); // Empty dependency array ensures that useEffect only runs once on component mount

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8800/info");
            const responseData = res.data;

            const newData = responseData.map(item => Object.values(item));
            const newColumns = Object.keys(responseData[0]);

            setData(newData);
            setColumns(newColumns);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>INFO</h1>
            <div className='info'>
                <GrRefresh onClick={handleRefresh} />
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Grid
                        data={data}
                        columns={columns}
                    />
                )}
            </div>
        </div>
    );
}

export default Info;
