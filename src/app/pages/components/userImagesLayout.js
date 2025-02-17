import { Carousel, Modal } from 'react-bootstrap';
import styles from './userImagesLayout.module.css';
import React, { useState } from 'react';
import Image from "next/image";

function UserImagesLayout({ post }) {

  if (!post?.images || post.images.length === 0) {
    return null;
  }

  const [openModalId, setOpenModalId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getGridClass = (count) => {
    switch (count) {
      case 1:
        return styles.gridLayout1;
      case 2:
        return styles.gridLayout2;
      case 3:
        return styles.gridLayout3;
      case 4:
        return styles.gridLayout4;
      case 5:
        return styles.gridLayout5;
      default:
        return styles.gridLayoutMore;
    }
  };

  const visibleImages = post?.images?.length > 5
    ? post.images.slice(0, 5)
    : post?.images;
  const remainingCount = post?.images?.length > 5 ? post?.images?.length - 5 : 0;
  const isModalOpen = openModalId === post.id;

  return (
    <div className={styles.imageGridWrapper}>
      <div className={`${styles.postImagesContainer} ${getGridClass(post?.images?.length)}`}>
        {visibleImages?.map((image, index) => (
          <div
            key={index}
            className={`${styles.imageContainer} ${post.images.length === 3 && index === 0 ? styles.firstOfThree :
                post.images.length === 5 && index === 0 ? styles.firstOfFive : ''
              }`}
            onClick={() => {
              setActiveIndex(index);
              setOpenModalId(post.id);
            }}
          >
            <Image
              src={image.media_path}
              alt={`Post image ${index + 1}`}
              fill
              className={styles.postImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
              loader={({ src }) => src}
            />
            {index === 4 && remainingCount > 0 && (
              <div className={styles.remainingCount}>
                +{remainingCount}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        show={isModalOpen}
        onHide={() => setOpenModalId(null)}
        centered
        size="xl"
        className={styles.carouselModal}
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <Carousel
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            interval={null}
            indicators={true}
            className={styles.carousel}
          >
            {post.images?.map((image, idx) => (
              <Carousel.Item key={idx}>
                <div className={styles.carouselImageWrapper}>
                  <Image
                    src={image.media_path}
                    alt={`Image ${idx + 1}`}
                    fill
                    className={styles.carouselImage}
                    sizes="90vw"
                    priority
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserImagesLayout;