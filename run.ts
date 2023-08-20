import fs from 'fs';

function between(main, str1: string, str2: string, startindex: number = 0): string {
    const startIndex = main.indexOf(str1, startindex);
    if (startIndex === -1) return '';

    const endIndex = main.indexOf(str2, startIndex + str1.length);
    if (endIndex === -1) return '';

    return main.substring(startIndex + str1.length, endIndex);
}

let raw = fs.readFileSync("./jrnls.html", "utf8")

let list = raw.split("\n")
list = list.map(x => between(x, '<DT><A HREF="', '"'))


let flist: Array<any> = []
const GetSpeeds = async (issn) => {
    try {
        let text = await (await fetch(`https://journalinsights.elsevier.com/journals/${issn}/review_speed`)).text();
        let body = between(text, "<div class='line' id='popover'>", "<div class='legend inline");
        body = body.substring(body.indexOf("2022"))
        let firstDecision = between(body, 'First decision:', '</li>')
        firstDecision = between(firstDecision, "<span class='first_decision value'>", '<span')
        let finalDecision = between(body, 'Final decision:', '</li>')
        finalDecision = between(finalDecision, "<span class='final_disposition value'>", '<span')
        return { firstDecision: parseFloat(firstDecision.trim()) || null, finalDecision: parseFloat(finalDecision.trim()) || null }
    } catch {
        return { firstDecision: null, finalDecision: null }
    }
}


const FetchScopus = async (url) => {
    let ret = await (await fetch(url, {
        "headers": {
            Authority: "www.scopus.com",
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "cache-control": "no-cache",
            "Newrelic": `eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjEyODExNjEiLCJhcCI6IjMxNDU1OTQ0IiwiaWQiOiI5MmFiOWIzMDFjMTdlZTcyIiwidHIiOiJiOTUxOTQ0YWNhYjgwZDU3MjJjYjk5NGM5ZWQxZGIwMCIsInRpIjoxNjg3NzgwOTg4MDI5LCJ0ayI6IjIwMzgxNzUifX0=`,
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-1496e0f5359734dcb8570068fb71ad00-766c4708c7823df9-01",
            "Tracestate": "2038175@nr=0-1-1281161-31455944-92ab9b301c17ee72----1687780988029",
            "X-Newrelic-Id": "VQQPUFdVCRADVVVXAwABVA==",
            "x-requested-with": "X-Requested-With",
            "cookie": `SCSessionID=4F0A8CF83A8E693EA377DD028DC56AE4.i-0f0ff3528f77f2700; scopusSessionUUID=c27a8756-e937-42cf-9; scopus.machineID=4F0A8CF83A8E693EA377DD028DC56AE4.i-0f0ff3528f77f2700; AWSELB=CB9317D502BF07938DE10C841E762B7A33C19AADB1EEDAB0CAE1EA61C26EE33655F1A3A7041CFAF561CA8FAE7428B054EAF931D43510BA32070D9964CEACBAE7C5777723B77231E040B72A817D9761CB4E71854C5B; Scopus-usage-key=enable-logging; AT_CONTENT_COOKIE="FEATURE_DOCUMENT_RESULT_MICRO_UI:1,"; at_check=true; __cfruid=6473619ff4d6233f401c204d4561d8a31cf1004e-1687780956; AMCVS_4D6368F454EC41940A4C98A6%40AdobeOrg=1; SCOPUS_JWT=eyJraWQiOiJjYTUwODRlNi03M2Y5LTQ0NTUtOWI3Zi1kMjk1M2VkMmRiYmMiLCJhbGciOiJSUzI1NiJ9.eyJhbmFseXRpY3NfaW5mbyI6eyJhY2NvdW50SWQiOiIyNzg2NDEiLCJhY2NvdW50TmFtZSI6IlNjb3B1cyBQcmV2aWV3IiwiYWNjZXNzVHlwZSI6ImFlOlJFRzpVX1A6R1VFU1Q6IiwidXNlcklkIjoiYWU6MjE2MjU4MjQ3In0sImRlcGFydG1lbnROYW1lIjoiU2NvcHVzIFByZXZpZXciLCJzdWIiOiIyMTYyNTgyNDciLCJpbnN0X2FjY3RfbmFtZSI6IlNjb3B1cyBQcmV2aWV3Iiwic3Vic2NyaWJlciI6ZmFsc2UsImRlcGFydG1lbnRJZCI6IjI4OTgzOSIsImlzcyI6IlNjb3B1cyIsImluc3RfYWNjdF9pZCI6IjI3ODY0MSIsImluc3RfYXNzb2NfbWV0aG9kIjoiIiwiZ2l2ZW5fbmFtZSI6IkFybWluIiwicGF0aF9jaG9pY2UiOmZhbHNlLCJhdWQiOiJTY29wdXMiLCJuYmYiOjE2ODc3OTE4MjgsImZlbmNlcyI6W10sImluZHZfaWRlbnRpdHlfbWV0aG9kIjoiIiwiaW5zdF9hc3NvYyI6IkdVRVNUIiwiaW5kdl9pZGVudGl0eSI6IlJFRyIsIm5hbWUiOiJBcm1pbiBLYXJkYW4iLCJ1c2FnZVBhdGhJbmZvIjoiKDIxNjI1ODI0NyxVfDI4OTgzOSxEfDI3ODY0MSxBfDcyMjE4LFB8MSxQTCkoU0NPUFVTLENPTnxhNmUzNDVjZTY2OGZhODQ2MDY1OGI2ZTVhMTMzODY4Y2FmMDJneHJxYSxTU098UkVHX0dVRVNULEFDQ0VTU19UWVBFKSIsImV4cCI6MTY4Nzc5MjcyOCwiYXV0aF90b2tlbiI6ImE2ZTM0NWNlNjY4ZmE4NDYwNjU4YjZlNWExMzM4NjhjYWYwMmd4cnFhIiwiaWF0IjoxNjg3NzkxODI4LCJmYW1pbHlfbmFtZSI6IkthcmRhbiIsImVtYWlsIjoiYXJtaW4uZmlyZUBnbWFpbC5jb20ifQ.X6aj9G6-7r22rSUsWXDc6wilIEO4MwgGnwnIrixSZ1J095ZzWj1ViUiUCkoGQaOHPwuhZIvUXaPCOYDpioo4qir5ObHO2yYvGvhNv9oiq75Z2kz-QDW-G4u34Bf20rE65wBIh4qE-eJT600HkExT7mfwkaVlFONVfD7PotpJ7y_e7aRnmAAbV7ISWENocbySOVA2P7NjjbhoCDmTnZN-VUkwvly9npR2EKb6Mnb9YEmutmQzNLO3rKoeiCmufSHMnsIUpKVruyjph9z1ZKWCq-K5sq_qoiwLJkMYDN77Ai4aa6Y982Qn8J8EnezVOcKPjSbU1CiLGACGAOo8VZLtfA; mbox=PC#a0ad5baf530b4080bb6a0007306006cd.34_0#1751036636|session#3c51a12170084f05a39cfdcbd9ec24bf#1687793696; AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=-2121179033%7CMCIDTS%7C19535%7CMCMID%7C43149953019871194630869909309666381443%7CMCAAMLH-1688396638%7C7%7CMCAAMB-1688396638%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1687799038s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0%7CMCCIDH%7C-1749206918; s_pers=%20v8%3D1687791838525%7C1782399838525%3B%20v8_s%3DLess%2520than%25201%2520day%7C1687793638525%3B%20c19%3Dsc%253Arecord%253Asource%2520info%7C1687793638528%3B%20v68%3D1687791831587%7C1687793638533%3B; s_sess=%20s_cpc%3D0%3B%20c13%3Dcitescore-asc%3B%20c7%3Dyear%253D2022%3B%20s_ppvl%3Dsc%25253Asearch%25253Asource%252520results%252C100%252C3%252C23766%252C1536%252C754%252C1536%252C864%252C1.25%252CP%3B%20e41%3D1%3B%20s_sq%3D%3B%20s_cc%3Dtrue%3B%20s_ppv%3Dsc%25253Arecord%25253Asource%252520info%252C96%252C44%252C1654%252C1536%252C754%252C1536%252C864%252C1.25%252CP%3B`,
            // "Referer": "https://www.scopus.com/sourceid/29403",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            Host: "www.scopus.com",

            "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`
        },
        redirect: "manual"
    })).text()

    // console.log(ret)
    return ret;
}



const FetchCat = async (url) => {
    return await (await fetch(url, {
        "headers": {
            Authority: "www.scopus.com",
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "cache-control": "no-cache",
            "Newrelic": `eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjEyODExNjEiLCJhcCI6IjMxNDU1OTQ0IiwiaWQiOiIyZjkwNWIzZTM5ZjhiMGJiIiwidHIiOiJmYWZlMmEyOWYzZDI2Y2U2NTVhZWI4NDBjZmM2N2YwMCIsInRpIjoxNjg3NzgwOTY3NTQ3LCJ0ayI6IjIwMzgxNzUifX0=`,
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "traceparent": "00-1496e0f5359734dcb8570068fb71ad00-766c4708c7823df9-01",
            "Tracestate": "2038175@nr=0-1-1281161-31455944-2f905b3e39f8b0bb----1687780967547",
            "X-Newrelic-Id": "VQQPUFdVCRADVVVXAwABVA==",
            "x-requested-with": "X-Requested-With",
            "cookie": `SCSessionID=4F0A8CF83A8E693EA377DD028DC56AE4.i-0f0ff3528f77f2700; scopusSessionUUID=c27a8756-e937-42cf-9; scopus.machineID=4F0A8CF83A8E693EA377DD028DC56AE4.i-0f0ff3528f77f2700; AWSELB=CB9317D502BF07938DE10C841E762B7A33C19AADB1EEDAB0CAE1EA61C26EE33655F1A3A7041CFAF561CA8FAE7428B054EAF931D43510BA32070D9964CEACBAE7C5777723B77231E040B72A817D9761CB4E71854C5B; SCOPUS_JWT=eyJraWQiOiJjYTUwODRlNi03M2Y5LTQ0NTUtOWI3Zi1kMjk1M2VkMmRiYmMiLCJhbGciOiJSUzI1NiJ9.eyJhbmFseXRpY3NfaW5mbyI6eyJhY2NvdW50SWQiOiIyNzg2NDEiLCJhY2NvdW50TmFtZSI6IlNjb3B1cyBQcmV2aWV3IiwiYWNjZXNzVHlwZSI6ImFlOlJFRzpVX1A6R1VFU1Q6IiwidXNlcklkIjoiYWU6MjE2MjU4MjQ3In0sImRlcGFydG1lbnROYW1lIjoiU2NvcHVzIFByZXZpZXciLCJzdWIiOiIyMTYyNTgyNDciLCJpbnN0X2FjY3RfbmFtZSI6IlNjb3B1cyBQcmV2aWV3Iiwic3Vic2NyaWJlciI6ZmFsc2UsImRlcGFydG1lbnRJZCI6IjI4OTgzOSIsImlzcyI6IlNjb3B1cyIsImluc3RfYWNjdF9pZCI6IjI3ODY0MSIsImluc3RfYXNzb2NfbWV0aG9kIjoiIiwiZ2l2ZW5fbmFtZSI6IkFybWluIiwicGF0aF9jaG9pY2UiOmZhbHNlLCJhdWQiOiJTY29wdXMiLCJuYmYiOjE2ODc3ODA5NDYsImZlbmNlcyI6W10sImluZHZfaWRlbnRpdHlfbWV0aG9kIjoiVV9QIiwiaW5zdF9hc3NvYyI6IkdVRVNUIiwiaW5kdl9pZGVudGl0eSI6IlJFRyIsIm5hbWUiOiJBcm1pbiBLYXJkYW4iLCJ1c2FnZVBhdGhJbmZvIjoiKDIxNjI1ODI0NyxVfDI4OTgzOSxEfDI3ODY0MSxBfDcyMjE4LFB8MSxQTCkoU0NPUFVTLENPTnxhNmUzNDVjZTY2OGZhODQ2MDY1OGI2ZTVhMTMzODY4Y2FmMDJneHJxYSxTU098UkVHX0dVRVNULEFDQ0VTU19UWVBFKSIsImV4cCI6MTY4Nzc4MTg0NiwiYXV0aF90b2tlbiI6ImE2ZTM0NWNlNjY4ZmE4NDYwNjU4YjZlNWExMzM4NjhjYWYwMmd4cnFhIiwiaWF0IjoxNjg3NzgwOTQ2LCJmYW1pbHlfbmFtZSI6IkthcmRhbiIsImVtYWlsIjoiYXJtaW4uZmlyZUBnbWFpbC5jb20ifQ.sHa6lRqtN7wOZfSTEdzVETWCOw8AhBU0H1wKPYvp8GRsrQuTdzFSQL1VapWNDibux09gwbLePzFlA_y4A6as9pdD7BKtR9KB1ljh3m17Cw2fc7MW1X35SriRTEe4McYTbh7zqF4YNkNHsm5VzjbHX5C6tAVgv4mVY9Z-P5QNP9xGiIaFgSgUP-3Cg3vqOErI906KfxTLyu-x044mq0Pl2Pej4ZNSVi9uWhP_n5EJhtIPzKB0Z4LHUK5jUNEQmoQ7G1hWopKnxnpI0CRPkgu94q_ixvsrnTtTpbC_3eUPow1R5E0PC3n9iKAt83wZWE8K03VbBvEmg91zM7XyS546Gg; Scopus-usage-key=enable-logging; AT_CONTENT_COOKIE="FEATURE_DOCUMENT_RESULT_MICRO_UI:1,"; at_check=true; __cfruid=6473619ff4d6233f401c204d4561d8a31cf1004e-1687780956; AMCVS_4D6368F454EC41940A4C98A6%40AdobeOrg=1; mbox=session#a0ad5baf530b4080bb6a0007306006cd#1687782826|PC#a0ad5baf530b4080bb6a0007306006cd.34_0#1751025766; s_pers=%20v8%3D1687780968828%7C1782388968828%3B%20v8_s%3DFirst%2520Visit%7C1687782768828%3B%20c19%3Dsc%253Arecord%253Asource%2520info%7C1687782768831%3B%20v68%3D1687780962047%7C1687782768837%3B; s_sess=%20s_ppvl%3Dsc%25253Arecord%25253Asource%252520info%252C43%252C43%252C754%252C1536%252C754%252C1536%252C864%252C1.25%252CP%3B%20e41%3D1%3B%20s_cpc%3D0%3B%20s_cc%3Dtrue%3B%20s_ppv%3Dsc%25253Arecord%25253Asource%252520info%252C43%252C43%252C754%252C1536%252C754%252C1536%252C864%252C1.25%252CP%3B; AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=-2121179033%7CMCIDTS%7C19535%7CMCMID%7C43149953019871194630869909309666381443%7CMCAAMLH-1688385769%7C7%7CMCAAMB-1688385769%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1687788169s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0%7CMCCIDH%7C-1749206918; __cf_bm=_FDOWqq72lnVrHjIp1gfx4F0RBStwuaWnc.MxPR1Q28-1687782288-0-Ad83o41aGzA+lBVc+aRQZWifMMHiGtD4dZfNAWl2tN95q4PYOAaqkrXB2mx6WaqpPznvqNwzpHe2bNe+qzXJZbE=`,
            "Referer": "https://www.scopus.com/sourceid/29403",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            Host: "www.scopus.com",

            "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`
        },
        redirect: "manual"
    })).json()
}


const FetchSpringer = async (url) => {
    return await (await fetch(url, {
        "headers": {
            "authority": "www.springer.com",
            "accept-encoding": "gzip, deflate, br",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "cookie": `idp_session=sVERSION_1cb1e8378-130e-457b-998a-3103c1a1c42c; idp_session_http=hVERSION_18c0744d4-609d-4917-8a11-9c93c74e47c7; idp_marker=921bf1ee-c345-4a3b-ac7f-b47a55203764`,
            "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`,
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    })).text()
}
    // fs.writeFileSync("./json.json",JSON.stringify(JSON.parse(json),null,2))
    ;
(async () => {

    let scopus = JSON.parse(fs.readFileSync("./scopus.json", 'utf8'))

    console.log("The scopus length:", scopus.length);

    for (let url of list) {


        if (false && url.startsWith('https://www.sciencedirect.com/journal')) {
            console.log("Starting:", url)
            let text = await (await fetch(url + "/about/insights")).text();
            let name = between(text, '<title data-react-helmet="true">', " |");
            let issn = between(text, 'Print ISSN: ', "<").trim()
            let json: any = between(text, '<script type="application/json" data-iso-key="_0">', "</script>").trim().replace(/\\\\\"/g, "\\\"").replace(/\\\"/g, '"').substring(1);
            json = (json as string).substring(0, json.length - 1)

            try {
                json = JSON.parse(json)
            } catch {
                console.log("CATCHED...")
                continue
                // return;
            }

            let sp = await GetSpeeds(issn)

            // console.log(json.titleMetadata.mendeleyDatasetUrl)

            let editors: Array<any> = [];
            for (let g of json.titleMetadata.editorialBoard.groups) {
                if (g.members) {
                    editors.push(...g.members)
                }
            }

            let sjson: any = await FetchScopus("https://www.scopus.com/api/rest/sources/" + json.titleMetadata.scopusSourceId)

            let catkeys = Object.keys(sjson.fullSubjectAreas || {})
            let categories: Array<any> = []
            for (let cat of catkeys) {
                console.log("fetching cat:" + cat)
                let jsn = await FetchCat(`https://www.scopus.com/source/journalRanking/${json.titleMetadata.scopusSourceId}.uri?category=${cat}&offset=1&year=2022`)
                // console.log("RANK:", jsn.curentJournal.rank+"/"+ jsn.totalJournals)
                categories.push({
                    code: cat,
                    name: sjson.fullSubjectAreas[cat],
                    value: jsn.curentJournal.rank + "/" + jsn.totalJournals
                })
            }

            let lastYearAccepted = null;
            let ReviewTime = null;

            for (let it of json.titleMetadata.journalMetrics.journalInsights) {
                if (it.metricKey == "time_to_1st_decision") {
                    sp.firstDecision = it.value;
                }
                else if (it.metricKey == "review_time") {
                    ReviewTime = it.value;
                }
                else if (it.metricKey == "publication_time") {
                    sp.finalDecision = it.value;
                }
                else if (it.metricKey == "publication_options") {
                    let v = it.value;
                    let keys = Object.keys(v)
                    lastYearAccepted = it.value[keys[keys.length - 1]].subscription_articles
                }
            }

            flist.push({
                name: json.titleMetadata.displayName,
                url,
                issn,
                from: sjson.coverageList[0].coverageStart,
                firstDecision: sp.firstDecision,
                finalDecision: sp.finalDecision,
                ReviewTime,
                mendeleyDatasetUrl: json.titleMetadata.mendeleyDatasetUrl,
                impactFactor: json.titleMetadata.journalMetrics.bannerMetrics.impactFactor?.value || null,
                citeScore: json.titleMetadata.journalMetrics.bannerMetrics.citeScore?.value || null,
                scopus: "https://www.scopus.com/sourceid/" + json.titleMetadata.scopusSourceId,
                // lastYearAccepted2: json.titleMetadata.journalMetrics.journalInsights,
                lastYearAccepted,
                callforPapers: json.marketingContent.elements["call-for-papers"]?.items?.map(i => {
                    return {
                        summary: i.url,
                        explain: i.description,
                        expire: i.expiryDate
                    }
                }) || [],
                editors,
                categories,
            })

            fs.writeFileSync("./pashmam.json", JSON.stringify(flist, null, 2))
            // break;
        }
        else if (url.startsWith('https://www.springer.com/journal/')) {
            console.log("Starting:", url)
            let text = await FetchSpringer(url)
            let IF = between(text, 'data-test="impact-factor-value">', '</dd').split(" ")[0]
            let speed = parseFloat(between(text, 'data-test="metrics-speed-value">', '</dd').split(" ")[0]);
            let issn = between(text, 'c-list-description__details u-ma-0">', '</dd');
            let sc = scopus.find(s => s.issn.toString().replace("-", "") == issn.replace("-", ""));
            let name = sc?.name || between(text, '<title>', '</title>').split("|")[0].trim();
            let from = sc?.from || "1990";
            let citeScore = sc?.citescore || null;
            let firstDecision = speed / 7;
            console.log(IF)
            // break;

            // let editors: Array<any> = [];
            // for (let g of json.titleMetadata.editorialBoard.groups) {
            //     if (g.members) {
            //         editors.push(...g.members)
            //     }
            // }
            let lastYearAccepted: any = null;
            let ThisYearAccepted: any = null;
            let ReviewTime = null;
            let categories: Array<any> = []
            if (sc) {
                console.log("getting cat:", "https://www.scopus.com/api/rest/sources/" + sc.scopusid.toString().replace("-", ""))
                let sjson: any = await FetchScopus("https://www.scopus.com/api/rest/sources/" + sc.scopusid.toString().replace("-", ""))
                sjson = between(sjson, '"fullSubjectAreas":', "}") + "}";
                try {
                    sjson = JSON.parse(sjson)
                    sc.fullSubjectAreas = sjson;
                    let catkeys = Object.keys(sc.fullSubjectAreas || {})
                    console.log("Fetchcat...")
                    for (let cat of catkeys) {
                        console.log("fetching cat:" + cat)
                        let jsn = await FetchCat(`https://www.scopus.com/source/journalRanking/${sc.scopusid.toString().replace("-", "")}.uri?category=${cat}&offset=1&year=2022`)
                        console.log("RANK:", jsn.curentJournal.rank + "/" + jsn.totalJournals)
                        categories.push({
                            code: cat,
                            name: sc.fullSubjectAreas[cat],
                            value: jsn.curentJournal.rank + "/" + jsn.totalJournals
                        })
                    }
                } catch { }



                let count: any = await FetchScopus(`https://www.scopus.com/source/sourceInfoAdditional/contentCoverage/${sc.scopusid.toString().replace("-", "")}.uri`);
                count = JSON.parse(count).coverage?.[0];
                if (count) {
                    let ks = Object.keys(count).filter(s => !isNaN(parseInt(s)));
                    ks.sort((a, b) => parseInt(b) - parseInt(a));

                    lastYearAccepted = parseInt((count[ks[1]])?.count) || null
                    ThisYearAccepted = parseInt((count[ks[0]])?.count) || null
                }

            }




            // let updates = ""
            // if (text.toLowerCase().includes("call for paper")) {
            //     updates = between(text, '<h3 class="c-listing__title u-text-md">', 'class="');
            //     updates = "https://www.springer.com/"+between(updates, '<a href="', '"').trim();
            //     updates = await (await fetch(updates)).text();
            // }

            flist.push({
                name,
                url,
                issn,
                quartile:null,
                from,
                firstDecision,
                finalDecision: null,
                ReviewTime: null,
                mendeleyDatasetUrl: null,
                impactFactor: IF || null,
                citeScore,
                scopus: sc ? ("https://www.scopus.com/sourceid/" + sc?.scopusid) : null,
                lastYearAccepted,
                ThisYearAccepted,
                categories,
            })

            fs.writeFileSync("./springer.json", JSON.stringify(flist, null, 2))
            // break;
        }
    }

    // console.log(flist)

})();


