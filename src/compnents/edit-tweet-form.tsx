import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface IEditTweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  updateAt: number;
}

interface EditTweetFormProps {
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
  tweetInfo: IEditTweet;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf9;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf9;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf9;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const BtnArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf9;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  width: 48%;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const CancleBtn = styled.button`
  background-color: white;
  color: black;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  width: 48%;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const EditTweetForm: React.FC<EditTweetFormProps> = ({
  onCancel,
  tweetInfo,
}) => {
  const [isEditLoading, setEditLoading] = useState(false);
  const [editTweet, setEditTweet] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (
      !user ||
      isEditLoading ||
      tweetInfo.tweet === "" ||
      tweetInfo.tweet.length > 180
    )
      return;

    try {
      setEditLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet: editTweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (editFile) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, editFile);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setEditTweet("");
      setEditFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <TextArea
          rows={5}
          maxLength={180}
          onChange={onChange}
          placeholder="Edit your tweet"
          defaultValue={tweetInfo.tweet}
        ></TextArea>
        <AttachFileButton htmlFor="file">
          {editFile ? "Photo added ✅" : "Change photo"}
        </AttachFileButton>
        <AttachFileInput type="file" id="file" accept="image/*" />
        <BtnArea>
          <CancleBtn onClick={onCancel}>Cancel</CancleBtn>
          <SubmitBtn
            type="submit"
            value={isEditLoading ? "Posting..." : "Edit Tweet"}
          />
        </BtnArea>
      </Form>
    </div>
  );
};

export default EditTweetForm;
