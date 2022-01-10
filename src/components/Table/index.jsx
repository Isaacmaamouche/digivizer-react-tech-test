import React, { useState } from "react";
import '../../style/table.css';

export default function Table(props){
    console.log('rendering');
    let authors = props.author;
    let posts = props.post;
    let headers = {
            Author : 'Author',
            Date : 'Date', 
            Post : 'Post',
            PostImage : 'Post Image',
            LikesCount : 'Likes Count',
            CommentsCount : 'Comments Count',
            TotalEngagment : 'Total Engagement'
    }
    const [sortedData, setSortedData] = useState();
    if(sortedData === undefined) setSortedData(datasetBuilder());

    function sortAscending(arr, key) {
        function sortParameter(a, b) {           
            if(typeof a[key] === 'number'){
                return a[key] - b[key];
            }
            else if(typeof a[key]==='string'){
                let fa = a[key].toLowerCase();
                let fb = b[key].toLowerCase();
                if (fa < fb) return -1;
                if (fa > fb) return 1;
                return 0;
            }
            else{
                console.error('sorting key is not a number, nor a string');
            }
        }
        arr.sort(sortParameter);
    }

    function sortDescending(arr, key) {
        function sortParameter(a, b) {           
            if(typeof a[key] === 'number'){
                return b[key] - a[key];
            }
            else if(typeof a[key]==='string'){
                let fa = a[key].toLowerCase();
                let fb = b[key].toLowerCase();
                if (fa > fb) return -1;
                if (fa < fb) return 1;
                return 0;
            }
            else{
                console.error('sorting key is not a number, nor a string');
            }
        }
        arr.sort(sortParameter);
    }

    function monthName(date){ 
        return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
    }

    function datasetBuilder(direction, key){
        if(direction===undefined) direction='DESCENDING';
        if(key===undefined) key='TotalEngagment';
        let data=[];
        console.log('building dataset from posts and authors');
        posts.forEach((post, index) =>{
            let totalEngagment = post.node.likes_count + post.node.comments_count;
            let date = new Date(post.node.date);
            let formattedDate = `${date.getDate()} ${monthName(date)} ${date.getFullYear()}`;
            data = [...data, {
                Author : authors.filter(author=>author.uid===post.node.author.uid)[0].name,
                Date : formattedDate, 
                Post : post.node.post,
                PostImage : post.node.image_url&&<img src={post.node.image_url} width={'20px'} height={'20px'} alt={'post thumbnail'} />,
                LikesCount : post.node.likes_count==null ? 0:post.node.likes_count,
                CommentsCount : post.node.comments_count==null ? 0:post.node.comments_count,
                TotalEngagment : totalEngagment==null ? 0:totalEngagment
                }];
        })
        if(direction==='DESCENDING'){
            sortDescending(data, key);
            console.log(`descending on key ${key}`);
        }else{
            sortAscending(data, key);
            console.log(`ascending on key ${key}`);
        }
        return data;
    }

    function updateData(newData){
        console.log(`updating the dataset`);
        setSortedData(newData);
    }

    function handleSort(e){
        let direction = e.target.getAttribute('data-sort_order');
        let key = e.target.getAttribute('data-sortkey');
        if(key === 'PostImage') return;
        document.querySelectorAll('th').forEach(each => each.setAttribute('data-sort_order', 'ASCENDING'))
        let nextDirection = direction === 'ASCENDING'?'DESCENDING':'ASCENDING';
        e.target.setAttribute('data-sort_order', nextDirection);
        updateData(datasetBuilder(direction, key));      
    }

    return (
        <table>
            <thead>
                <tr>
                    {Object.entries(headers).map(([sortKey, header], index) => 
                    <th key={`header-${index}`} data-sort_order='ASCENDING' data-sortkey={sortKey} onClick={(e)=>handleSort(e)}>{header}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {sortedData&&sortedData.map((post, index) => 
                    <tr key={`post-${index}`}>
                        {Object.values(post).map((value, idx) => <td key={`${index}-${idx}`}>{value}</td>)}
                    </tr>
                )}
            </tbody>
        </table>
    )
}