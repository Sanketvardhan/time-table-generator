import React, { useEffect, useState } from 'react';
import './Sty.css'
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
            <div className='top'>
                <h1>Subject-Teacher Information</h1>
                <div className='refresh-icon'>
                    <GrRefresh onClick={handleRefresh} />
                </div>
            </div>
            <div className='info'>
            {/* style={{height: '400px' , overflow: 'auto'}} */}
                <div className='table'>
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
        </div>
    );
}

export default Info;
